package com.dreamcampus.backend.university;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorite_universities")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FavoriteUniversity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "university_id", nullable = false)
    private Long universityId;

    // DB가 기본값(현재 시각)을 넣으므로 코드에서는 읽기만 한다
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public static FavoriteUniversity create(Long userId, Long universityId) {
        FavoriteUniversity favorite = new FavoriteUniversity();
        favorite.userId = userId;
        favorite.universityId = universityId;
        return favorite;
    }
}