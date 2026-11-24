import { useCallback, useEffect, useState } from 'react';
import { useStudyApi } from './StudyApiContext.js';
import { addDays, toDateString } from '../../utils/formatTime.js';
import SubjectStatsCard from './SubjectStatsCard.jsx';
import TodaySummaryCard from './TodaySummaryCard.jsx';
import WeeklyChartCard from './WeeklyChartCard.jsx';

// 과목별 통계의 조회 기간. 전체 기간이면 날짜를 보내지 않는다.
function subjectRange(range) {
  const today = new Date();
  if (range === 'week') {
    const sinceMonday = (today.getDay() + 6) % 7;   // 월요일 0, 일요일 6
    return { from: toDateString(addDays(today, -sinceMonday)), to: toDateString(today) };
  }
  if (range === 'month') {
    return { from: toDateString(new Date(today.getFullYear(), today.getMonth(), 1)), to: toDateString(today) };
  }
  return {};
}

export default function StudyStatsPanel() {
  const api = useStudyApi();
  const [reloadKey, setReloadKey] = useState(0);     // 값이 바뀌면 통계를 다시 불러온다
  const [weekOffset, setWeekOffset] = useState(0);   // 0 = 이번 주, 1 = 지난주 ...
  const [range, setRange] = useState('week');

  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [error, setError] = useState('');
  const [needLogin, setNeedLogin] = useState(false);

  const handleError = useCallback((e) => {
    if (e.status === 401) setNeedLogin(true);
    else setError(e.message);
  }, []);

  // 오늘 통계
  useEffect(() => {
    let ignore = false;
    api.getDailyStat(toDateString(new Date()))
      .then((data) => { if (!ignore) setDaily(data); })
      .catch((e) => { if (!ignore) handleError(e); });
    return () => { ignore = true; };
  }, [reloadKey, handleError]);

  // 주간 통계
  useEffect(() => {
    let ignore = false;
    api.getWeeklyStat(toDateString(addDays(new Date(), -7 * weekOffset)))
      .then((data) => { if (!ignore) setWeekly(data); })
      .catch((e) => { if (!ignore) handleError(e); });
    return () => { ignore = true; };
  }, [weekOffset, reloadKey, handleError]);

  // 과목별 통계
  useEffect(() => {
    let ignore = false;
    const { from, to } = subjectRange(range);
    api.getSubjectStats(from, to)
      .then((data) => { if (!ignore) setSubjects(data); })
      .catch((e) => { if (!ignore) handleError(e); });
    return () => { ignore = true; };
  }, [range, reloadKey, handleError]);

  // 목표를 저장하면 달성률과 주간 목표 달성 일수가 달라지므로 다시 불러온다
  const handleSaveGoal = async (minutes) => {
    await api.updateGoal(minutes);
    setReloadKey((key) => key + 1);
  };

  if (needLogin) {
    return (
      <section className="panel study-panel">
        <p className="study-empty">로그인이 필요해요. 로그인한 뒤에 다시 열어 주세요.</p>
      </section>
    );
  }

  return (
    <>
      {error && <p className="study-error" role="alert">{error}</p>}

      {daily ? (
        <TodaySummaryCard daily={daily} onSaveGoal={handleSaveGoal} />
      ) : (
        <section className="panel study-panel">
          <p className="study-empty">불러오는 중이에요...</p>
        </section>
      )}

      <WeeklyChartCard
        weekly={weekly}
        weekOffset={weekOffset}
        onPrev={() => setWeekOffset((offset) => offset + 1)}
        onNext={() => setWeekOffset((offset) => Math.max(0, offset - 1))}
      />

      <SubjectStatsCard subjects={subjects} range={range} onChangeRange={setRange} />
    </>
  );
}