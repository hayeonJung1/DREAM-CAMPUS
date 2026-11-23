package com.dreamcampus.backend.study;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * users 테이블의 daily_goal_minutes 컬럼만 읽고 쓴다.
 * User 엔티티는 팀원 담당이라 건드리지 않고, 이 컬럼만 네이티브 SQL로 다룬다.
 */
@Repository
@RequiredArgsConstructor
public class StudyGoalRepository {

    private final EntityManager em;

    // 목표(분). 설정하지 않았으면 null
    public Integer findDailyGoalMinutes(Long userId) {
        List<?> rows = em.createNativeQuery("SELECT daily_goal_minutes FROM users WHERE user_id = :userId")
                .setParameter("userId", userId)
                .getResultList();
        if (rows.isEmpty() || rows.get(0) == null) {
            return null;
        }
        return ((Number) rows.get(0)).intValue();
    }

    // 목표 저장. minutes 가 null 이면 목표를 해제한다
    public void updateDailyGoalMinutes(Long userId, Integer minutes) {
        if (minutes == null) {
            em.createNativeQuery("UPDATE users SET daily_goal_minutes = NULL WHERE user_id = :userId")
                    .setParameter("userId", userId)
                    .executeUpdate();
            return;
        }
        em.createNativeQuery("UPDATE users SET daily_goal_minutes = :minutes WHERE user_id = :userId")
                .setParameter("minutes", minutes)
                .setParameter("userId", userId)
                .executeUpdate();
    }
}