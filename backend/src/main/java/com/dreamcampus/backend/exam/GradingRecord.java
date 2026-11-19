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
@Table(name = "grading_records")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GradingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "exam_subject_id", nullable = false)
    private Long examSubjectId;

    @Column(name = "data_status", nullable = false, length = 16)
    private String dataStatus;

    @Column(name = "submitted_answers_json", nullable = false, columnDefinition = "LONGTEXT")
    private String submittedAnswersJson;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "correct_count", nullable = false)
    private Integer correctCount;

    @Column(name = "wrong_count", nullable = false)
    private Integer wrongCount;

    @Column(name = "unanswered_count", nullable = false)
    private Integer unansweredCount;

    public static GradingRecord create(
            Long userId,
            Long examSubjectId,
            String dataStatus,
            String submittedAnswersJson,
            Integer score,
            Integer correctCount,
            Integer wrongCount,
            Integer unansweredCount
    ) {
        GradingRecord record = new GradingRecord();
        record.userId = userId;
        record.examSubjectId = examSubjectId;
        record.dataStatus = dataStatus;
        record.submittedAnswersJson = submittedAnswersJson;
        record.score = score;
        record.correctCount = correctCount;
        record.wrongCount = wrongCount;
        record.unansweredCount = unansweredCount;
        return record;
    }
}
