package com.dreamcampus.backend.exam;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.CurrentUser;
import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.exam.dto.QuestionNoteRequest;
import com.dreamcampus.backend.exam.dto.QuestionNoteResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.safety.Safelist;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamQuestionNoteController {

    private final CurrentUser currentUser;
    private final ExamQuestionNoteService noteService;
    private final ExamQuestionNoteRepository noteRepository;
    private final ExamSubjectRepository subjectRepository;

    private static final Safelist NOTE_HTML_SAFELIST = Safelist.relaxed()
            .addTags("mark", "span")
            .addAttributes(":all", "style")
            .addAttributes("img", "src", "alt", "title", "width", "height")
            .preserveRelativeLinks(true);

    @GetMapping("/notes")
    public ApiResponse<List<QuestionNoteResponse>> getMyNotes(
            HttpServletRequest request
    ) {
        Long userId = getUserId(request);
        return ApiResponse.ok("오답노트 조회 성공", noteService.getMyNotes(userId));
    }

    @GetMapping("/notes/bookmarks")
    public ApiResponse<List<QuestionNoteResponse>> getMyBookmarks(
            HttpServletRequest request
    ) {
        Long userId = getUserId(request);
        return ApiResponse.ok("북마크 조회 성공", noteService.getMyBookmarks(userId));
    }

    @DeleteMapping("/notes/{noteId}")
public ApiResponse<Void> deleteNote(
        @PathVariable Long noteId,
        HttpServletRequest request
) {
    Long userId = getUserId(request);

    noteService.delete(userId, noteId);

    return ApiResponse.ok("오답노트 삭제 성공", null);
}

    @GetMapping("/{examSubjectId}/questions/{questionNumber}/note")
    public ApiResponse<QuestionNoteResponse> getNote(
            @PathVariable Long examSubjectId,
            @PathVariable Integer questionNumber,
            HttpServletRequest request
    ) {
        Long userId = getUserId(request);

        ExamSubject subject = subjectRepository.findById(examSubjectId)
                .orElseThrow(() -> ApiException.notFound("모의고사 과목을 찾을 수 없습니다."));

        validateQuestionNumber(subject, questionNumber);

        QuestionNoteResponse response = noteRepository
                .findByUserIdAndExamSubjectIdAndQuestionNumber(
                        userId, examSubjectId, questionNumber
                )
                .map(note -> QuestionNoteResponse.from(note, subject))
                .orElse(null);

        return ApiResponse.ok("문항 오답노트 조회 성공", response);
    }

    @PutMapping("/{examSubjectId}/questions/{questionNumber}/note")
    public ApiResponse<QuestionNoteResponse> saveNote(
            @PathVariable Long examSubjectId,
            @PathVariable Integer questionNumber,
            @Valid @RequestBody QuestionNoteRequest request,
            HttpServletRequest servletRequest
    ) {
        Long userId = getUserId(servletRequest);

        String safeHtml = sanitizeNoteHtml(request.contentHtml(), userId);

        QuestionNoteRequest safeRequest = new QuestionNoteRequest(
                safeHtml,
                request.bookmarked()
        );

        QuestionNoteResponse response = noteService.save(
                userId,
                examSubjectId,
                questionNumber,
                safeRequest
        );

        return ApiResponse.ok("오답노트 저장 성공", response);
    }

    private Long getUserId(HttpServletRequest request) {
        return currentUser.getId(request)
                .orElseThrow(() -> ApiException.unauthorized("로그인이 필요합니다."));
    }

    private void validateQuestionNumber(ExamSubject subject, Integer questionNumber) {
        if (questionNumber == null
                || questionNumber < 1
                || questionNumber > subject.getQuestionCount()) {
            throw ApiException.badRequest("문항 번호가 올바르지 않습니다.");
        }
    }

    private String sanitizeNoteHtml(String html, Long userId) {
        Document document = Jsoup.parseBodyFragment(html == null ? "" : html);

        for (Element image : document.select("img")) {
            String src = image.attr("src");
            String allowedPrefix = "/api/exams/notes/images/" + userId + "/";

            if (!src.startsWith(allowedPrefix)
                    || !src.matches("^/api/exams/notes/images/[0-9]+/[a-fA-F0-9-]+\\.(png|jpg|webp)$")) {
                image.remove();
            }
        }

        Set<String> allowedStyles = Set.of(
                "color",
                "background-color",
                "font-size",
                "text-align",
                "font-weight",
                "font-style",
                "text-decoration",
                "font-family"
        );

        for (Element element : document.body().getAllElements()) {
            if (!element.hasAttr("style")) {
                continue;
            }

            StringBuilder safeStyle = new StringBuilder();

            for (String declaration : element.attr("style").split(";")) {
                String[] parts = declaration.split(":", 2);

                if (parts.length != 2) {
                    continue;
                }

                String property = parts[0].trim().toLowerCase();
                String value = parts[1].trim();
                String lowerValue = value.toLowerCase();

                if (allowedStyles.contains(property)
                        && !lowerValue.contains("url(")
                        && !lowerValue.contains("expression")
                        && !lowerValue.contains("javascript")
                        && !lowerValue.contains("\\")) {

                    if (!safeStyle.isEmpty()) {
                        safeStyle.append(';');
                    }

                    safeStyle.append(property).append(':').append(value);
                }
            }

            if (safeStyle.isEmpty()) {
                element.removeAttr("style");
            } else {
                element.attr("style", safeStyle.toString());
            }
        }

        return Jsoup.clean(document.body().html(), "", NOTE_HTML_SAFELIST);
    }
}