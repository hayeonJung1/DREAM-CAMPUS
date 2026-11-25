package com.dreamcampus.backend.university;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface FavoriteUniversityRepository extends JpaRepository<FavoriteUniversity, Long> {

    // 최근에 등록한 순서
    List<FavoriteUniversity> findByUserIdOrderByIdDesc(Long userId);

    // 목록에 보이는 대학들 중 내가 관심 등록한 것
    List<FavoriteUniversity> findByUserIdAndUniversityIdIn(Long userId, Collection<Long> universityIds);

    boolean existsByUserIdAndUniversityId(Long userId, Long universityId);

    long deleteByUserIdAndUniversityId(Long userId, Long universityId);
}