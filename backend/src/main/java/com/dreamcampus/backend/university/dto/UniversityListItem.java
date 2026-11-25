package com.dreamcampus.backend.university.dto;

public record UniversityListItem(
        Long universityId,
        String name,
        String nameEn,
        String category,            // 대학 / 전문대학
        String schoolCategory,      // 대학교, 사이버대학(대학) ...
        String establishmentType,   // 사립, 국립 ...
        String address,             // 첫 번째 캠퍼스의 도로명 주소
        int campusCount,
        boolean favorite            // 로그인한 회원이 관심 등록했는지 (비로그인이면 항상 false)
) {
}