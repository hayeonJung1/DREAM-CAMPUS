import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.study.StudySession;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class StudySessionTest {

    private final LocalDateTime t0 = LocalDateTime.of(2026, 11, 21, 9, 0, 0);

    @Test
    void 일시정지_없이_종료하면_전체_시간이_공부_시간이다() {
        StudySession s = StudySession.start(1L, null, t0);
        s.stop(t0.plusMinutes(30));
        assertEquals(30 * 60, s.getDurationSeconds());
    }

    @Test
    void 쉰_시간은_공부_시간에서_빠진다() {
        StudySession s = StudySession.start(1L, null, t0);
        s.pause(t0.plusMinutes(10));    // 10분 공부
        s.resume(t0.plusMinutes(15));   // 5분 휴식
        s.stop(t0.plusMinutes(35));     // 20분 더 공부
        assertEquals(30 * 60, s.getDurationSeconds());
        assertEquals(5 * 60, s.getTotalPausedSeconds());
    }

    @Test
    void 일시정지_중에_종료하면_쉰_시간도_정리된다() {
        StudySession s = StudySession.start(1L, null, t0);
        s.pause(t0.plusMinutes(10));
        s.stop(t0.plusMinutes(25));     // 쉬는 중에 종료
        assertEquals(10 * 60, s.getDurationSeconds());
    }

    @Test
    void 일시정지_중에는_경과_시간이_늘지_않는다() {
        StudySession s = StudySession.start(1L, null, t0);
        s.pause(t0.plusMinutes(10));
        assertEquals(10 * 60, s.elapsedSeconds(t0.plusMinutes(50)));
    }

    @Test
    void 종료한_세션은_다시_종료할_수_없다() {
        StudySession s = StudySession.start(1L, null, t0);
        s.stop(t0.plusMinutes(1));
        assertThrows(ApiException.class, () -> s.stop(t0.plusMinutes(2)));
    }
}