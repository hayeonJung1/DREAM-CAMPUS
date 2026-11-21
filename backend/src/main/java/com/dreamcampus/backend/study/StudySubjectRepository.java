package com.dreamcampus.backend.study;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudySubjectRepository extends JpaRepository<StudySubject, Long> {

    List<StudySubject> findByUserIdAndActiveTrueOrderByIdAsc(Long userId);

    boolean existsByUserId(Long userId);

    // 숨긴 과목까지 포함해서 같은 이름이 있는지
    Optional<StudySubject> findByUserIdAndName(Long userId, String name);
}