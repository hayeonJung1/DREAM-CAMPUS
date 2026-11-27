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
@Table(name = "answer_keys")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnswerKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exam_subject_id", nullable = false)
    private Long examSubjectId;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(name = "correct_answer", nullable = false, length = 20)
    private String correctAnswer;

    @Column(name = "points", nullable = false)
    private Integer points;

    @Column(name = "question_type", nullable = false, length = 10)
    private String questionType;

    public void updateAdminFields(String correctAnswer, Integer points) {
        if (correctAnswer != null) {
            if (correctAnswer.isBlank() || correctAnswer.length() > 20) {
                throw new IllegalArgumentException("정답은 1자 이상 20자 이하로 입력해 주세요.");
            }
            this.correctAnswer = correctAnswer.trim();
        }
        if (points != null) {
            if (points < 0 || points > 100) {
                throw new IllegalArgumentException("배점은 0점 이상 100점 이하로 입력해 주세요.");
            }
            this.points = points;
        }
    }
}
