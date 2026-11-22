package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.study.dto.StudySessionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class StudySessionService {

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