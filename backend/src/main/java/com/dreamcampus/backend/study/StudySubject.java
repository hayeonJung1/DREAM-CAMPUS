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

@Entity
@Table(name = "study_subjects")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudySubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "study_subject_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "subject_name", nullable = false, length = 30)
    private String name;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    // DB가 기본값(현재 시각)을 넣으므로 코드에서는 읽기만 한다
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public static StudySubject create(Long userId, String name) {
        StudySubject subject = new StudySubject();
        subject.userId = userId;
        subject.name = name;
        subject.active = true;
        return subject;
    }
}