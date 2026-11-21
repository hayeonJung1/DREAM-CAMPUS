package com.dreamcampus.backend.study;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudySubjectRepository extends JpaRepository<StudySubject, Long> {

    List<StudySubject> findByUserIdAndActiveTrueOrderByIdAsc(Long userId);

    boolean existsByUserId(Long userId);

    // 보이는 과목 중에서만 같은 이름을 찾는다 (숨긴 과목은 이름 중복 검사에서 제외)
    Optional<StudySubject> findByUserIdAndNameAndActiveTrue(Long userId, String name);
}