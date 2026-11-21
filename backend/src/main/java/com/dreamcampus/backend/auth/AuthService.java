package com.dreamcampus.backend.auth;

import com.dreamcampus.backend.user.Member;
import com.dreamcampus.backend.user.MemberRepository;
import com.dreamcampus.backend.user.dto.LoginRequest;
import com.dreamcampus.backend.user.dto.RegisterRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
public class AuthService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Transactional
    public Member register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        String name = request.name().trim();

        if (memberRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("비밀번호는 UTF-8 기준 72바이트 이내로 입력해 주세요.");
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        Member member = Member.create(email, encodedPassword, name);

        return memberRepository.save(member);
    }

    @Transactional(readOnly = true)
    public Member authenticate(LoginRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "이메일 또는 비밀번호가 올바르지 않습니다."
                ));

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new IllegalArgumentException(
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        return member;
    }

    @Transactional(readOnly = true)
    public Member findById(Long userId) {
        return memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "회원 정보를 찾을 수 없습니다."
                ));
    }
}