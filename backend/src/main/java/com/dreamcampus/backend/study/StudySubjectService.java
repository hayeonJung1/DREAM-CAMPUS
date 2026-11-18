package com.dreamcampus.backend.study;

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
        // 과목이 숨긴 것까지 합쳐 0개일 때만 기본 과목을 만들어 준다
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
}