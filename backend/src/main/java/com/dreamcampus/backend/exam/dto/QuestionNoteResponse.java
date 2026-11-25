package com.dreamcampus.backend.exam.dto;

import com.dreamcampus.backend.exam.ExamQuestionNote;
import com.dreamcampus.backend.exam.ExamSubject;

import java.time.LocalDateTime;

public record QuestionNoteResponse(
        Long id,
        Long examSubjectId,
        String academicYear,
        Integer examMonth,
        String subjectName,
        String optionName,
        Integer questionNumber,
        String contentHtml,
        boolean bookmarked,
        LocalDateTime updatedAt
) {
    public static QuestionNoteResponse from(ExamQuestionNote note, ExamSubject subject) {
        return new QuestionNoteResponse(
                note.getId(),
                subject.getId(),
                subject.getAcademicYear(),
                subject.getExamMonth(),
                subject.getSubjectName(),
                subject.getOptionName(),
                note.getQuestionNumber(),
                note.getContentHtml(),
                note.isBookmarked(),
                note.getUpdatedAt()
        );
    }
}