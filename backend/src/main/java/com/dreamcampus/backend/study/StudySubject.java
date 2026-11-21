package com.dreamcampus.backend.study;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity     // 이 클래스는 DB와 연결된다
@Table(name = "study_subjects")     // 연결할 테이블 이름(안쓰면 클래스명)
@Getter     // Lombok
@NoArgsConstructor(access = AccessLevel.PROTECTED)      // Lombok : 기본 생성자 생성
public class StudySubject {

    @Id     // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT
    @Column(name = "study_subject_id")      // 연결할 컬럼 이름(필드명 id와 컬럼명이 달라서 지정)
    private Long id;

    @Column(name = "user_id", nullable = false) // NOT NULL 지정
    private Long userId;

    @Column(name = "subject_name", nullable = false, length = 30)  // VARCHAR(30)
    private String name;

    @Column(name = "is_active", nullable = false)
    private boolean active;     // DB의 is_active <-> 자바의 active(true=보임, false=숨김)

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // 새 과목을 만드는 메서드
    public static StudySubject create(Long userId, String name) {
        StudySubject subject = new StudySubject();
        subject.userId = userId;
        subject.name = name;
        subject.active = true;
        return subject;
    }

    public void rename(String name) {
        this.name = name;
    }

    public void activate() {
        this.active = true;
    }

    public void deactivate() {
        this.active = false;
    }
}