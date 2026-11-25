package com.dreamcampus.backend.university;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.time.LocalDate;

/** universities 테이블 (시드 SQL로 넣은 읽기 전용 데이터). 화면에 필요한 컬럼만 연결한다. */
@Entity
@Immutable
@Table(name = "universities")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class University {

    @Id
    @Column(name = "university_id")
    private Long id;

    @Column(name = "school_name")
    private String name;

    @Column(name = "school_name_en")
    private String nameEn;

    @Column(name = "university_category")
    private String category;              // 대학 / 전문대학

    @Column(name = "school_category")
    private String schoolCategory;        // 대학교, 사이버대학(대학), 기능대학 ...

    @Column(name = "establishment_type")
    private String establishmentType;     // 사립, 국립 ...

    @Column(name = "homepage")
    private String homepage;

    @Column(name = "established_date")
    private LocalDate establishedDate;
}