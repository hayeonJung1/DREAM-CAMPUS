package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.study.dto.StudySubjectRequest;
import com.dreamcampus.backend.study.dto.StudySubjectResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/study/subjects")
@RequiredArgsConstructor
public class StudySubjectController {

    private final StudySubjectService service;
    private final CurrentUser currentUser;

    @GetMapping
    public ApiResponse<List<StudySubjectResponse>> list(HttpServletRequest httpRequest) {
        return ApiResponse.ok("조회 성공", service.getMySubjects(userId(httpRequest)));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<StudySubjectResponse> create(HttpServletRequest httpRequest,
                                                    @Valid @RequestBody StudySubjectRequest body) {
        return ApiResponse.ok("과목이 추가되었습니다.", service.create(userId(httpRequest), body.name()));
    }

    @PutMapping("/{subjectId}")
    public ApiResponse<StudySubjectResponse> rename(HttpServletRequest httpRequest,
                                                    @PathVariable Long subjectId,
                                                    @Valid @RequestBody StudySubjectRequest body) {
        return ApiResponse.ok("과목이 수정되었습니다.", service.rename(userId(httpRequest), subjectId, body.name()));
    }

    @DeleteMapping("/{subjectId}")
    public ApiResponse<Void> delete(HttpServletRequest httpRequest, @PathVariable Long subjectId) {
        service.delete(userId(httpRequest), subjectId);
        return ApiResponse.ok("과목이 삭제되었습니다.", null);
    }

    // 로그인한 회원의 번호. 로그인하지 않았으면 401
    private Long userId(HttpServletRequest request) {
        return currentUser.getId(request)
                .orElseThrow(() -> ApiException.unauthorized("로그인이 필요해요."));
    }
}