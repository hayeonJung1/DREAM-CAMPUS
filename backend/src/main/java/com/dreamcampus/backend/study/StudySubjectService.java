package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.study.dto.StudySubjectResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudySubjectService {

    private static final List<String> DEFAULT_SUBJECTS =
            List.of("국어", "수학", "영어", "한국사", "탐구");

    private final StudySubjectRepository repository;

    @Transactional
    public List<StudySubjectResponse> getMySubjects(Long userId) {
        if (!repository.existsByUserId(userId)) {
            List<StudySubject> defaults = DEFAULT_SUBJECTS.stream()
                    .map(name -> StudySubject.create(userId, name))
                    .toList();
            repository.saveAll(defaults);
        }
        return repository.findByUserIdAndActiveTrueOrderByIdAsc(userId).stream()
                .map(StudySubjectResponse::from)
                .toList();
    }

    @Transactional
    public StudySubjectResponse create(Long userId, String rawName) {
        String name = rawName.trim();

        // 보이는 과목 중에 같은 이름이 있으면 중복. 숨긴 과목은 상관없다.
        if (repository.findByUserIdAndNameAndActiveTrue(userId, name).isPresent()) {
            throw ApiException.conflict("이미 있는 과목입니다.");
        }
        return StudySubjectResponse.from(repository.save(StudySubject.create(userId, name)));
    }

    @Transactional
    public StudySubjectResponse rename(Long userId, Long subjectId, String rawName) {
        StudySubject subject = findMine(userId, subjectId);
        String name = rawName.trim();

        repository.findByUserIdAndNameAndActiveTrue(userId, name)
                .filter(other -> !other.getId().equals(subjectId))   // 나 자신은 제외
                .ifPresent(other -> { throw ApiException.conflict("이미 있는 과목 이름입니다."); });

        subject.rename(name);
        return StudySubjectResponse.from(subject);
    }

    @Transactional
    public void delete(Long userId, Long subjectId) {
        findMine(userId, subjectId).deactivate();   // 진짜 삭제가 아니라 숨김
    }

    // 내 과목인지 확인하며 가져온다
    private StudySubject findMine(Long userId, Long subjectId) {
        StudySubject subject = repository.findById(subjectId)
                .orElseThrow(() -> ApiException.notFound("과목을 찾을 수 없습니다."));
        if (!subject.getUserId().equals(userId)) {
            throw ApiException.forbidden("내 과목이 아닙니다.");
        }
        if (!subject.isActive()) {
            throw ApiException.notFound("과목을 찾을 수 없습니다.");
        }
        return subject;
    }
}