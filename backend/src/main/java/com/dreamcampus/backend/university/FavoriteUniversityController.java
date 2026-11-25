package com.dreamcampus.backend.university;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.university.dto.UniversityListItem;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/favorites/universities")
@RequiredArgsConstructor
public class FavoriteUniversityController {

    private final UniversityService service;
    private final CurrentUser currentUser;

    @GetMapping
    public ApiResponse<List<UniversityListItem>> list(HttpServletRequest httpRequest) {
        return ApiResponse.ok("조회 성공", service.listFavorites(userId(httpRequest)));
    }

    @PostMapping("/{universityId}")
    public ApiResponse<Void> add(HttpServletRequest httpRequest, @PathVariable Long universityId) {
        service.addFavorite(userId(httpRequest), universityId);
        return ApiResponse.ok("관심 대학에 추가했어요.", null);
    }

    @DeleteMapping("/{universityId}")
    public ApiResponse<Void> remove(HttpServletRequest httpRequest, @PathVariable Long universityId) {
        service.removeFavorite(userId(httpRequest), universityId);
        return ApiResponse.ok("관심 대학에서 뺐어요.", null);
    }

    // 로그인한 회원의 번호. 로그인하지 않았으면 401
    private Long userId(HttpServletRequest request) {
        return currentUser.getId(request)
                .orElseThrow(() -> ApiException.unauthorized("로그인이 필요해요."));
    }
}