package com.dreamcampus.backend.exam.dto;

import com.dreamcampus.backend.exam.ExamSubject;

public record ExamSubjectResponse(
        Long examSubjectId,
        String academicYear,
        Integer examMonth,
        String subjectCode,
        String subjectName,
        String optionName,
        Integer questionCount,
        Integer maxScore,
        String dataStatus
) {
    public static ExamSubjectResponse from(ExamSubject subject) {
        return new ExamSubjectResponse(
                subject.getId(),
                subject.getAcademicYear(),
                subject.getExamMonth(),
                subject.getSubjectCode(),
                subject.getSubjectName(),
                subject.getOptionName(),
                subject.getQuestionCount(),
                subject.getMaxScore(),
                subject.getDataStatus()
        );
    }
}
