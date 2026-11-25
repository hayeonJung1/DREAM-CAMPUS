package com.dreamcampus.backend.exam.dto;

import jakarta.validation.constraints.Size;

public record QuestionNoteRequest(
        @Size(max = 200000, message = "오답노트는 20만 자까지 입력할 수 있습니다.")
        String contentHtml,
        boolean bookmarked
) {
}