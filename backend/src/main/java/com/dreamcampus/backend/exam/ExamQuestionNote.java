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
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "exam_question_notes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ExamQuestionNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "exam_subject_id", nullable = false)
    private Long examSubjectId;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(name = "content_html", nullable = false, columnDefinition = "LONGTEXT")
    private String contentHtml;

    @Column(name = "is_bookmarked", nullable = false)
    private boolean bookmarked;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public static ExamQuestionNote create(Long userId, Long examSubjectId, Integer questionNumber) {
        ExamQuestionNote note = new ExamQuestionNote();
        note.userId = userId;
        note.examSubjectId = examSubjectId;
        note.questionNumber = questionNumber;
        note.contentHtml = "";
        note.bookmarked = false;
        return note;
    }

    public void update(String contentHtml, boolean bookmarked) {
        this.contentHtml = contentHtml == null ? "" : contentHtml;
        this.bookmarked = bookmarked;
    }
}