package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.study.dto.StudySessionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudySessionService {

    private static final int MAX_RANGE_DAYS = 366;   // 한 번에 조회할 수 있는 최대 기간

    private final StudySessionRepository sessionRepository;
    private final StudySubjectRepository subjectRepository;
    private final StudySubjectService subjectService;

    @Transactional
    public StudySessionResponse start(Long userId, Long studySubjectId) {
        if (sessionRepository.existsByUserIdAndEndedAtIsNull(userId)) {
            throw ApiException.conflict("이미 진행 중인 공부가 있어요.");
        }
        if (studySubjectId != null) {
            subjectService.findMine(userId, studySubjectId);   // 내 과목이 맞는지 검사 (아니면 404/403)
        }
        LocalDateTime now = now();
        StudySession session = sessionRepository.save(StudySession.start(userId, studySubjectId, now));
        return toResponse(session, now);
    }

    @Transactional
    public StudySessionResponse pause(Long userId, Long sessionId) {
        StudySession session = findMySession(userId, sessionId);
        LocalDateTime now = now();
        session.pause(now);                    // save() 없이도 변경 감지로 DB에 반영된다
        return toResponse(session, now);
    }

    @Transactional
    public StudySessionResponse resume(Long userId, Long sessionId) {
        StudySession session = findMySession(userId, sessionId);
        LocalDateTime now = now();
        session.resume(now);
        return toResponse(session, now);
    }

    @Transactional
    public StudySessionResponse stop(Long userId, Long sessionId) {
        StudySession session = findMySession(userId, sessionId);
        LocalDateTime now = now();
        session.stop(now);
        return toResponse(session, now);
    }

    @Transactional(readOnly = true)
    public StudySessionResponse getActive(Long userId) {
        LocalDateTime now = now();
        return sessionRepository.findFirstByUserIdAndEndedAtIsNullOrderByIdDesc(userId)
                .map(session -> toResponse(session, now))
                .orElse(null);                 // 진행 중인 공부가 없으면 null
    }

    // 기록 목록: from~to(포함) 사이에 "시작한" 공부를 최근 것부터
    @Transactional(readOnly = true)
    public List<StudySessionResponse> list(Long userId, LocalDate from, LocalDate to) {
        if (from.isAfter(to)) {
            throw ApiException.badRequest("시작일이 종료일보다 늦을 수 없어요.");
        }
        if (ChronoUnit.DAYS.between(from, to) > MAX_RANGE_DAYS) {
            throw ApiException.badRequest("한 번에 조회할 수 있는 기간은 최대 1년이에요.");
        }
        LocalDateTime now = now();
        List<StudySession> sessions =
                sessionRepository.findStartedBetween(userId, from.atStartOfDay(), to.plusDays(1).atStartOfDay());

        // 삭제해서 숨긴 과목이어도 이름은 보여준다
        Set<Long> ids = sessions.stream()
                .map(StudySession::getStudySubjectId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<Long, String> names = subjectRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(StudySubject::getId, StudySubject::getName));

        List<StudySessionResponse> result = new ArrayList<>(sessions.stream()
                .map(s -> StudySessionResponse.of(
                        s, s.getStudySubjectId() == null ? null : names.get(s.getStudySubjectId()), now))
                .toList());
        Collections.reverse(result);           // 조회는 오래된 순이라 뒤집어서 최근 공부가 위로 오게 한다
        return result;
    }

    // 기록 삭제: 종료된 기록만. 진행 중인 공부는 먼저 종료해야 한다
    @Transactional
    public void delete(Long userId, Long sessionId) {
        StudySession session = findMySession(userId, sessionId);
        if (session.getEndedAt() == null) {
            throw ApiException.conflict("진행 중인 공부는 삭제할 수 없어요. 먼저 종료해 주세요.");
        }
        sessionRepository.delete(session);
    }

    // ---------- 내부 도우미 ----------

    // 내 세션인지 확인하며 가져온다
    private StudySession findMySession(Long userId, Long sessionId) {
        StudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> ApiException.notFound("공부 기록을 찾을 수 없어요."));
        if (!session.getUserId().equals(userId)) {
            throw ApiException.forbidden("내 공부 기록이 아니에요.");
        }
        return session;
    }

    private StudySessionResponse toResponse(StudySession session, LocalDateTime now) {
        return StudySessionResponse.of(session, subjectName(session.getStudySubjectId()), now);
    }

    // 숨긴(삭제한) 과목이어도 이름은 보여준다
    private String subjectName(Long studySubjectId) {
        if (studySubjectId == null) return null;
        return subjectRepository.findById(studySubjectId).map(StudySubject::getName).orElse(null);
    }

    // 초 단위로 맞춘 현재 시각 (DB의 DATETIME은 초 단위라 소수점이 반올림되는 것을 막는다)
    private LocalDateTime now() {
        return LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
    }
}