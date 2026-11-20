package com.dreamcampus.backend.exam;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.exam.dto.ExamSubjectResponse;
import com.dreamcampus.backend.exam.dto.GradeRequest;
import com.dreamcampus.backend.exam.dto.GradeResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final CurrentUser currentUser;

    @GetMapping
    public ApiResponse<List<ExamSubjectResponse>> list(
            @RequestParam(defaultValue = "2027학년도") String academicYear,
            @RequestParam(defaultValue = "9") Integer examMonth
    ) {
        return ApiResponse.ok("모의고사 과목 조회 성공", examService.getSubjects(academicYear, examMonth));
    }

    @PostMapping("/{examSubjectId}/grade")
    public ResponseEntity<ApiResponse<GradeResponse>> grade(
            @PathVariable Long examSubjectId,
            @RequestBody GradeRequest request,
            HttpServletRequest servletRequest
    ) {
        Long userId = currentUser.getId(servletRequest).orElse(null);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<GradeResponse>fail("로그인이 필요합니다."));
        }

        if (request == null || request.answers() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<GradeResponse>fail("제출한 답안이 없습니다."));
        }

        try {
            GradeResponse result = examService.grade(userId, examSubjectId, request.answers());

            return ResponseEntity.ok(
                    ApiResponse.ok("채점 성공", result)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<GradeResponse>fail(e.getMessage()));
        }
    }
}