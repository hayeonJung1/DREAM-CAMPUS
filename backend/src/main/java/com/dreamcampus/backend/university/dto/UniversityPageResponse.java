package com.dreamcampus.backend.university.dto;

import java.util.List;

public record UniversityPageResponse(
        List<UniversityListItem> items,
        int page,               // 0부터 시작
        int size,
        long totalElements,
        int totalPages,
        boolean loggedIn        // 화면이 관심 등록 버튼을 어떻게 보여줄지 정하는 데 쓴다
) {
}