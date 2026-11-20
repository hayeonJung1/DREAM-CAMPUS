package com.dreamcampus.backend.study.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StudySubjectRequest(
        @NotBlank(message = "과목 이름을 입력해 주세요.")
        @Size(max = 30, message = "과목 이름은 30자 이하로 입력해 주세요.")
        String name
) {
}