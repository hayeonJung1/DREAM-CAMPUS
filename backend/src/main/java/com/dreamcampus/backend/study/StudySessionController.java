package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.study.dto.StudySessionResponse;
import com.dreamcampus.backend.study.dto.StudySessionStartRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/study/sessions")
@RequiredArgsConstructor
public class StudySessionController {

    private final StudySessionService service;
    private final CurrentUser currentUser;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<StudySessionResponse> start(HttpServletRequest httpRequest,
                                                   @RequestBody(required = false) StudySessionStartRequest body) {
        Long subjectId = (body == null) ? null : body.studySubjectId();
        return ApiResponse.ok("공부를 시작했어요.", service.start(userId(httpRequest), subjectId));
    }

    @PutMapping("/{sessionId}/pause")
    public ApiResponse<StudySessionResponse> pause(HttpServletRequest httpRequest, @PathVariable Long sessionId) {
        return ApiResponse.ok("일시정지했어요.", service.pause(userId(httpRequest), sessionId));
    }

    @PutMapping("/{sessionId}/resume")
    public ApiResponse<StudySessionResponse> resume(HttpServletRequest httpRequest, @PathVariable Long sessionId) {
        return ApiResponse.ok("다시 시작했어요.", service.resume(userId(httpRequest), sessionId));
    }

    @PutMapping("/{sessionId}/stop")
    public ApiResponse<StudySessionResponse> stop(HttpServletRequest httpRequest, @PathVariable Long sessionId) {
        return ApiResponse.ok("공부를 마쳤어요.", service.stop(userId(httpRequest), sessionId));
    }

    @GetMapping("/active")
    public ApiResponse<StudySessionResponse> active(HttpServletRequest httpRequest) {
        return ApiResponse.ok("조회 성공", service.getActive(userId(httpRequest)));
    }

    // 로그인한 회원의 번호. 로그인하지 않았으면 401
    private Long userId(HttpServletRequest request) {
        return currentUser.getId(request)
                .orElseThrow(() -> ApiException.unauthorized("로그인이 필요해요."));
    }
}