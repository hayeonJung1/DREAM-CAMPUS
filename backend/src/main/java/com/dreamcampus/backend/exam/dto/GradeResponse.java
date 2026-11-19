package com.dreamcampus.backend.exam.dto;

import java.util.List;

public record GradeResponse(
        Long gradingRecordId,
        Long examSubjectId,
        String subjectName,
        String optionName,
        Integer score,
        Integer maxScore,
        Integer correctCount,
        Integer wrongCount,
        Integer unansweredCount,
        String dataStatus,
        List<QuestionResult> questionResults
) {
    public record QuestionResult(
            Integer questionNumber,
            String submittedAnswer,
            String correctAnswer,
            boolean isCorrect,
            Integer points
    ) {
    }
}