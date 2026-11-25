package com.dreamcampus.backend.university;

import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.university.dto.UniversityDetailResponse;
import com.dreamcampus.backend.university.dto.UniversityListItem;
import com.dreamcampus.backend.university.dto.UniversityPageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/** 대학 조회(로그인 불필요)와 관심 대학(로그인 필요). userId 가 null 이면 로그인하지 않은 요청이다. */
@Service
@RequiredArgsConstructor
public class UniversityService {

    private static final Set<String> CATEGORIES = Set.of("대학", "전문대학");
    private static final int DEFAULT_MAX_SIZE = 50;

    private final UniversityRepository universityRepository;
    private final UniversityCampusRepository campusRepository;
    private final FavoriteUniversityRepository favoriteRepository;

    // ---------- 목록·검색 ----------

    @Transactional(readOnly = true)
    public UniversityPageResponse search(Long userId, String keyword, String category, int page, int size) {
        String categoryFilter = (category == null) ? "" : category.trim();
        if (!categoryFilter.isEmpty() && !CATEGORIES.contains(categoryFilter)) {
            throw ApiException.badRequest("대학 구분은 '대학' 또는 '전문대학'만 쓸 수 있어요.");
        }

        PageRequest pageable = PageRequest.of(
                Math.max(0, page),
                Math.min(Math.max(1, size), DEFAULT_MAX_SIZE),
                Sort.by("name"));                                        // 가나다순
        Page<University> result = universityRepository.search(escapeLike(keyword), categoryFilter, pageable);

        return new UniversityPageResponse(
                toItems(result.getContent(), userId),
                result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages(),
                userId != null);
    }

    // ---------- 상세 ----------

    @Transactional(readOnly = true)
    public UniversityDetailResponse detail(Long userId, Long universityId) {
        University u = universityRepository.findById(universityId)
                .orElseThrow(() -> ApiException.notFound("대학을 찾을 수 없어요."));

        List<UniversityDetailResponse.CampusResponse> campuses =
                campusRepository.findByUniversityIdOrderByIdAsc(universityId).stream()
                        .map(UniversityDetailResponse.CampusResponse::from)
                        .toList();
        boolean favorite = userId != null && favoriteRepository.existsByUserIdAndUniversityId(userId, universityId);

        return new UniversityDetailResponse(
                u.getId(), u.getName(), u.getNameEn(), u.getCategory(), u.getSchoolCategory(),
                u.getEstablishmentType(), u.getEstablishedDate(), homepageUrl(u.getHomepage()),
                campuses, favorite, userId != null);
    }

    // ---------- 관심 대학 (로그인 필요) ----------

    @Transactional(readOnly = true)
    public List<UniversityListItem> listFavorites(Long userId) {
        List<Long> ids = favoriteRepository.findByUserIdOrderByIdDesc(userId).stream()
                .map(FavoriteUniversity::getUniversityId)
                .toList();
        if (ids.isEmpty()) {
            return List.of();
        }
        Map<Long, University> byId = universityRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(University::getId, u -> u));
        List<University> ordered = ids.stream().map(byId::get).filter(Objects::nonNull).toList();   // 최근 등록순 유지
        return toItems(ordered, userId);
    }

    // 이미 등록된 대학이면 아무 일도 하지 않는다 (같은 요청이 두 번 와도 안전)
    @Transactional
    public void addFavorite(Long userId, Long universityId) {
        if (!universityRepository.existsById(universityId)) {
            throw ApiException.notFound("대학을 찾을 수 없어요.");
        }
        if (!favoriteRepository.existsByUserIdAndUniversityId(userId, universityId)) {
            favoriteRepository.save(FavoriteUniversity.create(userId, universityId));
        }
    }

    // 등록되어 있지 않아도 에러 없이 끝난다
    @Transactional
    public void removeFavorite(Long userId, Long universityId) {
        favoriteRepository.deleteByUserIdAndUniversityId(userId, universityId);
    }

    // ---------- 내부 도우미 ----------

    // 대학 목록을 화면용 항목으로 바꾼다. 캠퍼스와 관심 여부는 한 번에 모아서 조회한다.
    private List<UniversityListItem> toItems(List<University> universities, Long userId) {
        if (universities.isEmpty()) {
            return List.of();
        }
        List<Long> ids = universities.stream().map(University::getId).toList();

        Map<Long, List<UniversityCampus>> campuses = campusRepository.findByUniversityIdInOrderByIdAsc(ids).stream()
                .collect(Collectors.groupingBy(UniversityCampus::getUniversityId));
        Set<Long> favoriteIds = (userId == null)
                ? Set.of()
                : favoriteRepository.findByUserIdAndUniversityIdIn(userId, ids).stream()
                .map(FavoriteUniversity::getUniversityId)
                .collect(Collectors.toSet());

        return universities.stream()
                .map(u -> {
                    List<UniversityCampus> list = campuses.getOrDefault(u.getId(), List.of());
                    String address = list.isEmpty() ? null : list.get(0).getRoadAddress();
                    return new UniversityListItem(
                            u.getId(), u.getName(), u.getNameEn(), u.getCategory(), u.getSchoolCategory(),
                            u.getEstablishmentType(), address, list.size(), favoriteIds.contains(u.getId()));
                })
                .toList();
    }

    // 검색어에 들어 있는 %, _ 를 일반 글자로 취급하게 만든다 (그대로 두면 모든 대학이 검색돼 버린다)
    private String escapeLike(String keyword) {
        if (keyword == null) return "";
        String trimmed = keyword.trim();
        if (trimmed.length() > 50) trimmed = trimmed.substring(0, 50);
        return trimmed.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }

    // DB에는 https:// 없이 저장되어 있어서 링크로 쓸 수 있게 붙여준다
    private String homepageUrl(String homepage) {
        if (homepage == null || homepage.isBlank()) return null;
        String h = homepage.trim();
        return (h.startsWith("http://") || h.startsWith("https://")) ? h : "https://" + h;
    }
}