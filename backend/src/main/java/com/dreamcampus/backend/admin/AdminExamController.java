package com.dreamcampus.backend.admin;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.exam.AnswerKey;
import com.dreamcampus.backend.exam.AnswerKeyRepository;
import com.dreamcampus.backend.exam.ExamSubject;
import com.dreamcampus.backend.exam.ExamSubjectRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/exam")
public class AdminExamController {

    private final ExamSubjectRepository subjectRepository;
    private final AnswerKeyRepository answerKeyRepository;
    private final AdminGuard adminGuard;

    public AdminExamController(
            ExamSubjectRepository subjectRepository,
            AnswerKeyRepository answerKeyRepository,
            AdminGuard adminGuard
    ) {
        this.subjectRepository = subjectRepository;
        this.answerKeyRepository = answerKeyRepository;
        this.adminGuard = adminGuard;
    }

    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> subjects(HttpServletRequest request) {
        adminGuard.requireAdmin(request);
        List<Map<String, Object>> result = subjectRepository.findAll().stream().map(this::subjectToMap).toList();
        return ResponseEntity.ok(ApiResponse.ok("시험 과목을 조회했습니다.", result));
    }

    @PutMapping("/subjects/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateSubject(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request
    ) {
        adminGuard.requireAdmin(request);
        ExamSubject subject = subjectRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("시험 과목을 찾을 수 없습니다."));
        try {
            subject.updateAdminFields(body.get("subjectName"), body.get("dataStatus"));
        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest(e.getMessage());
        }
        return ResponseEntity.ok(ApiResponse.ok("시험 과목 정보를 저장했습니다.", subjectToMap(subjectRepository.save(subject))));
    }

    @GetMapping("/subjects/{subjectId}/answers")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> answers(
            @PathVariable Long subjectId,
            HttpServletRequest request
    ) {
        adminGuard.requireAdmin(request);
        if (!subjectRepository.existsById(subjectId)) {
            throw ApiException.notFound("시험 과목을 찾을 수 없습니다.");
        }
        List<Map<String, Object>> result = answerKeyRepository.findByExamSubjectIdOrderByQuestionNumberAsc(subjectId)
                .stream().map(this::answerToMap).toList();
        return ResponseEntity.ok(ApiResponse.ok("정답 데이터를 조회했습니다.", result));
    }

    @PutMapping("/answers/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateAnswer(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request
    ) {
        adminGuard.requireAdmin(request);
        AnswerKey answer = answerKeyRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("정답 데이터를 찾을 수 없습니다."));
        String correctAnswer = body.get("correctAnswer") == null ? null : String.valueOf(body.get("correctAnswer"));
        Integer points = null;
        if (body.get("points") != null) {
            try {
                points = Integer.valueOf(String.valueOf(body.get("points")));
            } catch (NumberFormatException e) {
                throw ApiException.badRequest("배점은 숫자로 입력해 주세요.");
            }
        }
        try {
            answer.updateAdminFields(correctAnswer, points);
        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest(e.getMessage());
        }
        return ResponseEntity.ok(ApiResponse.ok("정답 데이터를 저장했습니다.", answerToMap(answerKeyRepository.save(answer))));
    }

    private Map<String, Object> subjectToMap(ExamSubject subject) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", subject.getId());
        map.put("academicYear", subject.getAcademicYear());
        map.put("examMonth", subject.getExamMonth());
        map.put("subjectCode", subject.getSubjectCode());
        map.put("subjectName", subject.getSubjectName());
        map.put("optionName", subject.getOptionName());
        map.put("questionCount", subject.getQuestionCount());
        map.put("maxScore", subject.getMaxScore());
        map.put("dataStatus", subject.getDataStatus());
        return map;
    }

    private Map<String, Object> answerToMap(AnswerKey answer) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", answer.getId());
        map.put("questionNumber", answer.getQuestionNumber());
        map.put("correctAnswer", answer.getCorrectAnswer());
        map.put("points", answer.getPoints());
        map.put("questionType", answer.getQuestionType());
        return map;
    }
}
