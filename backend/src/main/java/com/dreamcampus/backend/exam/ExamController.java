package com.dreamcampus.backend.exam;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.exam.dto.ExamSubjectResponse;
import com.dreamcampus.backend.exam.dto.GradeRequest;
import com.dreamcampus.backend.exam.dto.GradeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final CurrentUser currentUser;

    @GetMapping
    public ApiResponse<List<ExamSubjectResponse>> list(
            @RequestParam(defaultValue = "2027\uD559\uB144\uB3C4") String academicYear,
            @RequestParam(defaultValue = "9") Integer examMonth
    ) {
        return ApiResponse.ok("모의고사 과목 조회 성공", examService.getSubjects(academicYear, examMonth));
    }

    @PostMapping("/{examSubjectId}/grade")
    public ApiResponse<GradeResponse> grade(
            @PathVariable Long examSubjectId,
            @RequestBody GradeRequest request
    ) {
        if (request == null || request.answers() == null) {
            return ApiResponse.fail("제출한 답안이 없습니다.");
        }

        try {
            GradeResponse result = examService.grade(currentUser.getId(), examSubjectId, request.answers());
            return ApiResponse.ok("채점 성공", result);
        } catch (IllegalArgumentException e) {
            return ApiResponse.fail(e.getMessage());
        }
    }
}
