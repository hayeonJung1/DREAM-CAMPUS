package com.dreamcampus.backend.university.dto;

import com.dreamcampus.backend.university.UniversityCampus;

import java.time.LocalDate;
import java.util.List;

public record UniversityDetailResponse(
        Long universityId,
        String name,
        String nameEn,
        String category,
        String schoolCategory,
        String establishmentType,
        LocalDate establishedDate,
        String homepageUrl,         // https:// 가 붙은 주소. 홈페이지가 없으면 null
        List<CampusResponse> campuses,
        boolean favorite,
        boolean loggedIn
) {
    public record CampusResponse(String branchType, String address, String postcode, String phone, String fax) {
        public static CampusResponse from(UniversityCampus c) {
            return new CampusResponse(c.getBranchType(), c.getRoadAddress(), c.getRoadPostcode(), c.getPhone(), c.getFax());
        }
    }
}