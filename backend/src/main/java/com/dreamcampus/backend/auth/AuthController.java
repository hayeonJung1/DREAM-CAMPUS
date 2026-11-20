package com.dreamcampus.backend.auth;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.user.Member;
import com.dreamcampus.backend.user.dto.AuthResponse;
import com.dreamcampus.backend.user.dto.LoginRequest;
import com.dreamcampus.backend.user.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        try {
            authService.register(request);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<Void>ok("회원가입이 완료되었습니다.", null));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Void>fail(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest servletRequest
    ) {
        try {
            Member member = authService.authenticate(request);

            HttpSession existingSession = servletRequest.getSession(false);
            if (existingSession != null) {
                existingSession.invalidate();
            }

            HttpSession session = servletRequest.getSession(true);
            session.setAttribute("loginMemberId", member.getUserId());

            return ResponseEntity.ok(
                    ApiResponse.ok("로그인되었습니다.", AuthResponse.from(member))
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<AuthResponse>fail(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest servletRequest
    ) {
        HttpSession session = servletRequest.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok(
                ApiResponse.<Void>ok("로그아웃되었습니다.", null)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> me(
            HttpServletRequest servletRequest
    ) {
        HttpSession session = servletRequest.getSession(false);

        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<AuthResponse>fail("로그인이 필요합니다."));
        }

        Object loginMemberId = session.getAttribute("loginMemberId");

        if (!(loginMemberId instanceof Long userId)) {
            session.invalidate();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<AuthResponse>fail("로그인 정보가 유효하지 않습니다."));
        }

        try {
            Member member = authService.findById(userId);

            return ResponseEntity.ok(
                    ApiResponse.ok(
                            "회원 정보 조회에 성공했습니다.",
                            AuthResponse.from(member)
                    )
            );

        } catch (IllegalArgumentException e) {
            session.invalidate();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<AuthResponse>fail("로그인 정보가 유효하지 않습니다."));
        }
    }
}