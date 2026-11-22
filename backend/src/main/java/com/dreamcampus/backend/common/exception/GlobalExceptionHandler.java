package com.dreamcampus.backend.common.exception;

import com.dreamcampus.backend.common.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 우리가 일부러 던진 에러 (404, 409 등)
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApi(ApiException e) {
        return ResponseEntity.status(e.getStatus()).body(ApiResponse.fail(e.getMessage()));
    }

    // 입력값 검증 실패 (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("잘못된 요청입니다.");
        return ResponseEntity.badRequest().body(ApiResponse.fail(message));
    }

    // JSON 형식이 깨졌거나 본문이 없을 때
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnreadable(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest().body(ApiResponse.fail("요청 형식이 올바르지 않습니다."));
    }

    // DB의 유니크 규칙 등에 걸린 경우 (동시에 같은 요청이 두 번 들어왔을 때 등)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.fail("이미 처리됐거나 중복된 요청이에요. 잠시 후 다시 시도해 주세요."));
    }
}