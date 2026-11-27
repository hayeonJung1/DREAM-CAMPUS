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

    public void updateAdminFields(String subjectName, String dataStatus) {
        if (subjectName != null) {
            if (subjectName.isBlank() || subjectName.length() > 50) {
                throw new IllegalArgumentException("과목명은 1자 이상 50자 이하로 입력해 주세요.");
            }
            this.subjectName = subjectName.trim();
        }
        if (dataStatus != null) {
            if (!java.util.List.of("OFFICIAL", "DEMO", "NOT_READY").contains(dataStatus)) {
                throw new IllegalArgumentException("데이터 구분 값이 올바르지 않습니다.");
            }
            this.dataStatus = dataStatus;
        }
    }
}
