package com.dreamcampus.backend.study;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudySubjectRepository extends JpaRepository<StudySubject, Long> {

    // 내 과목 중 숨기지 않은 것만, 만든 순서대로
    List<StudySubject> findByUserIdAndActiveTrueOrderByIdAsc(Long userId);

    // 숨긴 과목까지 포함해서 내 과목이 하나라도 있는지
    boolean existsByUserId(Long userId);
}