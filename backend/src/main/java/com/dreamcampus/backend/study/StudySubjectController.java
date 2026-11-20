package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.study.dto.StudySubjectResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/study/subjects")
@RequiredArgsConstructor
public class StudySubjectController {

    private final StudySubjectService service;
    private final CurrentUser currentUser;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudySubjectResponse>>> list(
            HttpServletRequest servletRequest
    ) {
        Long userId = currentUser.getId(servletRequest).orElse(null);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<List<StudySubjectResponse>>fail("로그인이 필요합니다."));
        }

        return ResponseEntity.ok(
                ApiResponse.ok("조회 성공", service.getMySubjects(userId))
        );
    }
}