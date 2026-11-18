package com.dreamcampus.backend.study.dto;

import com.dreamcampus.backend.study.StudySubject;

public record StudySubjectResponse(Long studySubjectId, String name) {

    public static StudySubjectResponse from(StudySubject subject) {
        return new StudySubjectResponse(subject.getId(), subject.getName());
    }
}