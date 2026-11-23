package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.study.dto.StudyGoalRequest;
import com.dreamcampus.backend.study.dto.StudyGoalResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/study/goal")
@RequiredArgsConstructor
public class StudyGoalController {

    private final StudyGoalService service;
    private final CurrentUser currentUser;

    @GetMapping
    public ApiResponse<StudyGoalResponse> get(HttpServletRequest httpRequest) {
        return ApiResponse.ok("조회 성공", service.get(userId(httpRequest)));
    }

    @PutMapping
    public ApiResponse<StudyGoalResponse> update(HttpServletRequest httpRequest,
                                                 @Valid @RequestBody StudyGoalRequest body) {
        return ApiResponse.ok("목표가 저장되었어요.", service.update(userId(httpRequest), body.dailyGoalMinutes()));
    }

    // 로그인한 회원의 번호. 로그인하지 않았으면 401
    private Long userId(HttpServletRequest request) {
        return currentUser.getId(request)
                .orElseThrow(() -> ApiException.unauthorized("로그인이 필요해요."));
    }
}