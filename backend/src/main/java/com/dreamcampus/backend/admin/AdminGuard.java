package com.dreamcampus.backend.admin;

import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.user.Member;
import com.dreamcampus.backend.user.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class AdminGuard {

    private final CurrentUser currentUser;
    private final MemberRepository memberRepository;

    public AdminGuard(CurrentUser currentUser, MemberRepository memberRepository) {
        this.currentUser = currentUser;
        this.memberRepository = memberRepository;
    }

    public Member requireAdmin(HttpServletRequest request) {
        Long userId = currentUser.getId(request)
                .orElseThrow(() -> ApiException.unauthorized("로그인이 필요합니다."));

        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("로그인 정보를 확인할 수 없습니다."));

        if (!"ACTIVE".equals(member.getStatus())) {
            throw ApiException.forbidden("이용이 정지된 계정입니다.");
        }

        if (!"ADMIN".equals(member.getRole())) {
            throw ApiException.forbidden("관리자 권한이 필요합니다.");
        }

        return member;
    }
}
