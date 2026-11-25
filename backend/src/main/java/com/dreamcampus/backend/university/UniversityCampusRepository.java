package com.dreamcampus.backend.university;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface UniversityCampusRepository extends JpaRepository<UniversityCampus, Long> {

    List<UniversityCampus> findByUniversityIdOrderByIdAsc(Long universityId);

    // 목록 화면용: 여러 대학의 캠퍼스를 한 번에 가져온다
    List<UniversityCampus> findByUniversityIdInOrderByIdAsc(Collection<Long> universityIds);
}