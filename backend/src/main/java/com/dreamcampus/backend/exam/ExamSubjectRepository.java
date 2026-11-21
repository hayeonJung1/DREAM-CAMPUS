package com.dreamcampus.backend.exam;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamSubjectRepository extends JpaRepository<ExamSubject, Long> {

    List<ExamSubject> findByAcademicYearAndExamMonthOrderByIdAsc(String academicYear, Integer examMonth);
}
