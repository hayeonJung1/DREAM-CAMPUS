package com.dreamcampus.backend.university;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.university.dto.UniversityDetailResponse;
import com.dreamcampus.backend.university.dto.UniversityPageResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/universities")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityService service;
    private final CurrentUser currentUser;

    // 로그인하지 않아도 호출할 수 있다. 로그인했다면 관심 대학 여부(favorite)가 같이 내려간다.
    @GetMapping
    public ApiResponse<UniversityPageResponse> list(
            HttpServletRequest httpRequest,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Long userId = currentUser.getId(httpRequest).orElse(null);
        return ApiResponse.ok("조회 성공", service.search(userId, keyword, category, page, size));
    }

    @GetMapping("/{universityId}")
    public ApiResponse<UniversityDetailResponse> detail(HttpServletRequest httpRequest,
                                                        @PathVariable Long universityId) {
        Long userId = currentUser.getId(httpRequest).orElse(null);
        return ApiResponse.ok("조회 성공", service.detail(userId, universityId));
    }
}