package com.dreamcampus.backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerKeyRepository extends JpaRepository<AnswerKey, Long> {

    List<AnswerKey> findByExamSubjectIdOrderByQuestionNumberAsc(Long examSubjectId);
}
