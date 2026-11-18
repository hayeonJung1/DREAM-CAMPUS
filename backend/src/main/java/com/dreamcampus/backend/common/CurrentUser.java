package com.dreamcampus.backend.common;

import org.springframework.stereotype.Component;

/**
 * 현재 로그인한 회원의 번호를 알려주는 임시 클래스.
 * 로그인(JWT/세션)이 구현되면 인증 정보에서 꺼내도록 이 클래스 한 곳만 고친다.
 */

@Component
public class CurrentUser {

    public Long getId() {
        return 1L;   // TODO: 로그인 구현 후 교체
    }
}