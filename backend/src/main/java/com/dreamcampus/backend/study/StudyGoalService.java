package com.dreamcampus.backend.study;

import com.dreamcampus.backend.study.dto.StudyGoalResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudyGoalService {

    private final StudyGoalRepository repository;

    @Transactional(readOnly = true)
    public StudyGoalResponse get(Long userId) {
        return new StudyGoalResponse(repository.findDailyGoalMinutes(userId));
    }

    @Transactional
    public StudyGoalResponse update(Long userId, Integer dailyGoalMinutes) {
        repository.updateDailyGoalMinutes(userId, dailyGoalMinutes);
        return new StudyGoalResponse(dailyGoalMinutes);
    }
}