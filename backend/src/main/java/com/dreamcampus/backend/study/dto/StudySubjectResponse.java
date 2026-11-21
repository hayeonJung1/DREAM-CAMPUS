package com.dreamcampus.backend.study.dto;

import com.dreamcampus.backend.study.StudySubject;

// 값을 두개 넣을 수 있는 상자
public record StudySubjectResponse(Long studySubjectId, String name) {

    // 엔티티 -> 응답 상자로 변환
    public static StudySubjectResponse from(StudySubject subject) {
        return new StudySubjectResponse(subject.getId(), subject.getName());
    }
}