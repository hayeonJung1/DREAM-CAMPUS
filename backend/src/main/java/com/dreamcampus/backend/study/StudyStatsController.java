package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.study.dto.DailyStatResponse;
import com.dreamcampus.backend.study.dto.SubjectStatResponse;
import com.dreamcampus.backend.study.dto.WeeklyStatResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/study/statistics")
@RequiredArgsConstructor
public class StudyStatsController {

    private static final LocalDate EARLIEST = LocalDate.of(2000, 1, 1);   // 기간을 생략하면 전체 기간

    private final StudyStatsService service;
    private final CurrentUser currentUser;

    @GetMapping("/daily")
    public ApiResponse<DailyStatResponse> daily(
            HttpServletRequest httpRequest,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate target = (date != null) ? date : LocalDate.now();
        return ApiResponse.ok("조회 성공", service.daily(userId(httpRequest), target));
    }

    @GetMapping("/subjects")
    public ApiResponse<List<SubjectStatResponse>> subjects(
            HttpServletRequest httpRequest,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate start = (from != null) ? from : EARLIEST;
        LocalDate end = (to != null) ? to : LocalDate.now();
        return ApiResponse.ok("조회 성공", service.subjects(userId(httpRequest), start, end));
    }

    @GetMapping("/weekly")
    public ApiResponse<WeeklyStatResponse> weekly(
            HttpServletRequest httpRequest,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate target = (date != null) ? date : LocalDate.now();
        return ApiResponse.ok("조회 성공", service.weekly(userId(httpRequest), target));
    }

    // 로그인한 회원의 번호. 로그인하지 않았으면 401
    private Long userId(HttpServletRequest request) {
        return currentUser.getId(request)
                .orElseThrow(() -> ApiException.unauthorized("로그인이 필요해요."));
    }
}