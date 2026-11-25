package com.dreamcampus.backend.university;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UniversityRepository extends JpaRepository<University, Long> {

    // 이름(한글·영문)으로 검색하고 대학 구분으로 거른다. keyword, category 가 빈 문자열이면 그 조건은 쓰지 않는다.
    @Query("""
            select u from University u
            where (:keyword = '' or u.name like concat('%', :keyword, '%') or u.nameEn like concat('%', :keyword, '%'))
              and (:category = '' or u.category = :category)
            """)
    Page<University> search(@Param("keyword") String keyword,
                            @Param("category") String category,
                            Pageable pageable);
}