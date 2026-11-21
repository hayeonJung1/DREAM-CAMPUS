package com.dreamcampus.backend.exam;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exam_subjects")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ExamSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(name = "exam_month", nullable = false)
    private Integer examMonth;

    @Column(name = "subject_code", nullable = false, length = 50)
    private String subjectCode;

    @Column(name = "subject_name", nullable = false, length = 50)
    private String subjectName;

    @Column(name = "option_name", length = 50)
    private String optionName;

    @Column(name = "question_count", nullable = false)
    private Integer questionCount;

    @Column(name = "max_score", nullable = false)
    private Integer maxScore;

    @Column(name = "data_status", nullable = false, length = 16)
    private String dataStatus;
}
