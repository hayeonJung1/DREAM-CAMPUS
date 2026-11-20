package com.dreamcampus.backend.common;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CurrentUser {

    public Optional<Long> getId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return Optional.empty();
        }

        Object loginMemberId = session.getAttribute("loginMemberId");

        if (loginMemberId instanceof Long userId) {
            return Optional.of(userId);
        }

        return Optional.empty();
    }
}