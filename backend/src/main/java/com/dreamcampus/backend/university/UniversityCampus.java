package com.dreamcampus.backend.university;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

/** university_campuses 테이블 (읽기 전용). 대학 하나에 캠퍼스(위치)가 여러 개일 수 있다. */
@Entity
@Immutable
@Table(name = "university_campuses")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UniversityCampus {

    @Id
    @Column(name = "campus_id")
    private Long id;

    @Column(name = "university_id")
    private Long universityId;

    @Column(name = "branch_type")
    private String branchType;            // 본교, 제2캠퍼 ...

    @Column(name = "road_address")
    private String roadAddress;

    @Column(name = "road_postcode")
    private String roadPostcode;

    @Column(name = "phone")
    private String phone;

    @Column(name = "fax")
    private String fax;
}