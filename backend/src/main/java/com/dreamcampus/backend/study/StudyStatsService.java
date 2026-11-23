package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.study.dto.DailyStatResponse;
import com.dreamcampus.backend.study.dto.SubjectStatResponse;
import com.dreamcampus.backend.study.dto.WeeklyStatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyStatsService {

    private static final String FREE_STUDY = "자유 공부";

    private final StudySessionRepository sessionRepository;
    private final StudySubjectRepository subjectRepository;
    private final StudyGoalRepository goalRepository;

    // ---------- 일별 ----------

    @Transactional(readOnly = true)
    public DailyStatResponse daily(Long userId, LocalDate date) {
        LocalDateTime now = now();
        List<StudySession> sessions = sessionsBetween(userId, date, date);

        int total = 0;
        int active = 0;
        for (StudySession session : sessions) {
            int seconds = session.elapsedSeconds(now);   // 끝난 세션은 확정 시간, 진행 중이면 지금까지
            total += seconds;
            if (session.getEndedAt() == null) {
                active += seconds;
            }
        }
        Integer goalSeconds = goalSeconds(userId);
        return new DailyStatResponse(date, total, active, sessions.size(), goalSeconds, rate(total, goalSeconds));
    }

    // ---------- 과목별 ----------

    @Transactional(readOnly = true)
    public List<SubjectStatResponse> subjects(Long userId, LocalDate from, LocalDate to) {
        if (from.isAfter(to)) {
            throw ApiException.badRequest("시작일이 종료일보다 늦을 수 없어요.");
        }
        LocalDateTime now = now();
        List<StudySession> sessions = sessionsBetween(userId, from, to);

        // 과목 번호 → 이름 (삭제해서 숨긴 과목도 이름을 가져온다)
        Set<Long> ids = sessions.stream()
                .map(StudySession::getStudySubjectId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<Long, String> names = subjectRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(StudySubject::getId, StudySubject::getName));

        // 이름 기준으로 합산: 이름 → [초 합계, 세션 수]
        Map<String, int[]> grouped = new LinkedHashMap<>();
        int totalAll = 0;
        for (StudySession session : sessions) {
            Long subjectId = session.getStudySubjectId();
            String name = (subjectId == null) ? FREE_STUDY : names.getOrDefault(subjectId, FREE_STUDY);
            int seconds = session.elapsedSeconds(now);

            int[] sum = grouped.computeIfAbsent(name, key -> new int[2]);
            sum[0] += seconds;
            sum[1] += 1;
            totalAll += seconds;
        }

        final int total = totalAll;
        return grouped.entrySet().stream()
                .map(entry -> new SubjectStatResponse(
                        entry.getKey(), entry.getValue()[0], entry.getValue()[1], percent(entry.getValue()[0], total)))
                .sorted((a, b) -> Integer.compare(b.totalSeconds(), a.totalSeconds()))   // 많이 한 과목 먼저
                .toList();
    }

    // ---------- 주간 ----------

    @Transactional(readOnly = true)
    public WeeklyStatResponse weekly(Long userId, LocalDate date) {
        LocalDate start = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));   // 그 주의 월요일
        LocalDate end = start.plusDays(6);
        LocalDateTime now = now();

        int[] seconds = new int[7];
        for (StudySession session : sessionsBetween(userId, start, end)) {
            int index = (int) ChronoUnit.DAYS.between(start, session.getStartedAt().toLocalDate());
            seconds[index] += session.elapsedSeconds(now);
        }

        Integer goalSeconds = goalSeconds(userId);
        List<WeeklyStatResponse.DayStat> days = new ArrayList<>();
        int total = 0;
        int studiedDays = 0;
        int achievedDays = 0;
        for (int i = 0; i < 7; i++) {
            LocalDate day = start.plusDays(i);
            String label = day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.KOREAN);   // 월, 화, ...
            days.add(new WeeklyStatResponse.DayStat(day, label, seconds[i]));
            total += seconds[i];
            if (seconds[i] > 0) studiedDays++;
            if (goalSeconds != null && seconds[i] >= goalSeconds) achievedDays++;
        }
        Integer achieved = (goalSeconds == null) ? null : achievedDays;
        return new WeeklyStatResponse(start, end, days, total, studiedDays, goalSeconds, achieved);
    }

    // ---------- 내부 도우미 ----------

    // fromDate 0시부터 toDate 하루 끝까지(toDate 포함) 시작한 세션
    private List<StudySession> sessionsBetween(Long userId, LocalDate fromDate, LocalDate toDate) {
        return sessionRepository.findStartedBetween(
                userId, fromDate.atStartOfDay(), toDate.plusDays(1).atStartOfDay());
    }

    private Integer goalSeconds(Long userId) {
        Integer minutes = goalRepository.findDailyGoalMinutes(userId);
        return (minutes == null) ? null : minutes * 60;
    }

    // 달성률(%) 소수 첫째 자리까지. 목표가 없으면 null
    private Double rate(int totalSeconds, Integer goalSeconds) {
        if (goalSeconds == null || goalSeconds == 0) return null;
        return Math.round(totalSeconds * 1000.0 / goalSeconds) / 10.0;
    }

    private double percent(int part, int total) {
        if (total == 0) return 0;
        return Math.round(part * 1000.0 / total) / 10.0;
    }

    private LocalDateTime now() {
        return LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }
}