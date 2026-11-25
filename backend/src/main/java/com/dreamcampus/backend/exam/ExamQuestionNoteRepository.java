package com.dreamcampus.backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamQuestionNoteRepository extends JpaRepository<ExamQuestionNote, Long> {

    Optional<ExamQuestionNote> findByUserIdAndExamSubjectIdAndQuestionNumber(
            Long userId,
            Long examSubjectId,
            Integer questionNumber
    );

    Optional<ExamQuestionNote> findByIdAndUserId(
            Long id,
            Long userId
    );

    List<ExamQuestionNote> findByUserIdOrderByUpdatedAtDesc(Long userId);

    List<ExamQuestionNote> findByUserIdAndBookmarkedTrueOrderByUpdatedAtDesc(Long userId);
}