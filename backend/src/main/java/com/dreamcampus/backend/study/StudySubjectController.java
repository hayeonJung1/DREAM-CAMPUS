package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.study.dto.StudySubjectResponse;
import lombok.RequiredArgsConstructor;
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
    public ApiResponse<List<StudySubjectResponse>> list() {
        return ApiResponse.ok("조회 성공", service.getMySubjects(currentUser.getId()));
    }
}