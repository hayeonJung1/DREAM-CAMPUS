package com.dreamcampus.backend.exam;

import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.exam.dto.QuestionNoteRequest;
import com.dreamcampus.backend.exam.dto.QuestionNoteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamQuestionNoteService {

    private final ExamQuestionNoteRepository noteRepository;
    private final ExamSubjectRepository examSubjectRepository;

    @Transactional
    public QuestionNoteResponse save(
            Long userId,
            Long examSubjectId,
            Integer questionNumber,
            QuestionNoteRequest request
    ) {
        if (request == null) {
            throw ApiException.badRequest("오답노트 내용을 입력해 주세요.");
        }

        ExamSubject subject = examSubjectRepository.findById(examSubjectId)
                .orElseThrow(() -> ApiException.notFound("모의고사 과목을 찾을 수 없습니다."));

        if (questionNumber == null || questionNumber < 1
                || questionNumber > subject.getQuestionCount()) {
            throw ApiException.badRequest("문항 번호가 올바르지 않습니다.");
        }

        ExamQuestionNote note = noteRepository
                .findByUserIdAndExamSubjectIdAndQuestionNumber(
                        userId, examSubjectId, questionNumber
                )
                .orElseGet(() -> ExamQuestionNote.create(
                        userId, examSubjectId, questionNumber
                ));

        note.update(request.contentHtml(), request.bookmarked());

        ExamQuestionNote saved = noteRepository.save(note);

        return QuestionNoteResponse.from(saved, subject);
    }

    @Transactional
    public void delete(Long userId, Long noteId) {
        ExamQuestionNote note = noteRepository
                .findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> ApiException.notFound("오답노트를 찾을 수 없습니다."));

        noteRepository.delete(note);
    }

    @Transactional(readOnly = true)
    public List<QuestionNoteResponse> getMyNotes(Long userId) {
        return toResponses(noteRepository.findByUserIdOrderByUpdatedAtDesc(userId));
    }

    @Transactional(readOnly = true)
    public List<QuestionNoteResponse> getMyBookmarks(Long userId) {
        return toResponses(
                noteRepository.findByUserIdAndBookmarkedTrueOrderByUpdatedAtDesc(userId)
        );
    }

    private List<QuestionNoteResponse> toResponses(List<ExamQuestionNote> notes) {
        if (notes.isEmpty()) {
            return List.of();
        }

        Set<Long> subjectIds = notes.stream()
                .map(ExamQuestionNote::getExamSubjectId)
                .collect(Collectors.toSet());

        Map<Long, ExamSubject> subjects = examSubjectRepository.findAllById(subjectIds)
                .stream()
                .collect(Collectors.toMap(ExamSubject::getId, Function.identity()));

        return notes.stream()
                .map(note -> {
                    ExamSubject subject = subjects.get(note.getExamSubjectId());

                    if (subject == null) {
                        throw ApiException.notFound("모의고사 과목을 찾을 수 없습니다.");
                    }

                    return QuestionNoteResponse.from(note, subject);
                })
                .toList();
    }
}