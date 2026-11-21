package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.study.dto.StudySubjectResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<StudySubjectResponse> create(@Valid @RequestBody StudySubjectRequest request) {
        return ApiResponse.ok("과목이 추가되었습니다.", service.create(currentUser.getId(), request.name()));
    }

    @PutMapping("/{subjectId}")
    public ApiResponse<StudySubjectResponse> rename(@PathVariable Long subjectId,
                                                    @Valid @RequestBody StudySubjectRequest request) {
        return ApiResponse.ok("과목이 수정되었습니다.", service.rename(currentUser.getId(), subjectId, request.name()));
    }

    @DeleteMapping("/{subjectId}")
    public ApiResponse<Void> delete(@PathVariable Long subjectId) {
        service.delete(currentUser.getId(), subjectId);
        return ApiResponse.ok("과목이 삭제되었습니다.", null);
    }
}