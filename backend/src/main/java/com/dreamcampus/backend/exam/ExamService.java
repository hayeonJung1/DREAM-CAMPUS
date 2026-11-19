package com.dreamcampus.backend.exam;

import com.dreamcampus.backend.exam.dto.ExamSubjectResponse;
import com.dreamcampus.backend.exam.dto.GradeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamSubjectRepository examSubjectRepository;
    private final AnswerKeyRepository answerKeyRepository;
    private final GradingRecordRepository gradingRecordRepository;

    @Transactional(readOnly = true)
    public List<ExamSubjectResponse> getSubjects(String academicYear, Integer examMonth) {
        return examSubjectRepository
                .findByAcademicYearAndExamMonthOrderByIdAsc(academicYear, examMonth)
                .stream()
                .map(ExamSubjectResponse::from)
                .toList();
    }

    @Transactional
    public GradeResponse grade(Long userId, Long examSubjectId, Map<Integer, String> submittedAnswers) {
        ExamSubject subject = examSubjectRepository.findById(examSubjectId)
                .orElseThrow(() -> new IllegalArgumentException("모의고사 과목을 찾을 수 없습니다."));

        if ("NOT_READY".equals(subject.getDataStatus())) {
            throw new IllegalArgumentException("아직 정답이 등록되지 않은 과목입니다.");
        }

        List<AnswerKey> answerKeys = answerKeyRepository
                .findByExamSubjectIdOrderByQuestionNumberAsc(examSubjectId);

        if (answerKeys.size() != subject.getQuestionCount()) {
            throw new IllegalArgumentException("정답 데이터가 완전하지 않아 채점할 수 없습니다.");
        }

        Map<Integer, String> normalizedAnswers = new LinkedHashMap<>();
        if (submittedAnswers != null) {
            for (Map.Entry<Integer, String> entry : submittedAnswers.entrySet()) {
                Integer questionNumber = entry.getKey();
                if (questionNumber == null || questionNumber < 1 || questionNumber > subject.getQuestionCount()) {
                    throw new IllegalArgumentException("문항 번호가 올바르지 않습니다.");
                }

                String answer = entry.getValue();
                if (answer == null || answer.isBlank()) {
                    continue;
                }

                String normalizedAnswer = answer.trim();
                if (!normalizedAnswer.matches("[0-9]+")) {
                    throw new IllegalArgumentException("답안은 숫자로 입력해 주세요.");
                }
                normalizedAnswers.put(questionNumber, normalizedAnswer);
            }
        }

        int score = 0;
        int correctCount = 0;
        int answeredCount = normalizedAnswers.size();
        List<GradeResponse.QuestionResult> questionResults = new ArrayList<>();

        for (AnswerKey answerKey : answerKeys) {
            Integer questionNumber = answerKey.getQuestionNumber();
            String submittedAnswer = normalizedAnswers.get(questionNumber);
            String correctAnswer = answerKey.getCorrectAnswer();
            boolean isCorrect = submittedAnswer != null && submittedAnswer.equals(correctAnswer);

            if (isCorrect) {
                score += answerKey.getPoints();
                correctCount++;
            }

            questionResults.add(new GradeResponse.QuestionResult(
                    questionNumber,
                    submittedAnswer,
                    correctAnswer,
                    isCorrect,
                    answerKey.getPoints()
            ));
        }

        int wrongCount = answeredCount - correctCount;
        int unansweredCount = subject.getQuestionCount() - answeredCount;
        String submittedAnswersJson = normalizedAnswers.entrySet().stream()
                .map(entry -> "\"" + entry.getKey() + "\":\"" + entry.getValue() + "\"")
                .collect(Collectors.joining(",", "{", "}"));

        GradingRecord savedRecord = gradingRecordRepository.save(GradingRecord.create(
                userId,
                examSubjectId,
                subject.getDataStatus(),
                submittedAnswersJson,
                score,
                correctCount,
                wrongCount,
                unansweredCount
        ));

        return new GradeResponse(
                savedRecord.getId(),
                subject.getId(),
                subject.getSubjectName(),
                subject.getOptionName(),
                score,
                subject.getMaxScore(),
                correctCount,
                wrongCount,
                unansweredCount,
                subject.getDataStatus(),
                questionResults
        );
    }
}
