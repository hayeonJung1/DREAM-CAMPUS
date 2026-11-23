import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { formatDuration, formatShort, toDateString } from '../../utils/formatTime.js';

// "2026-11-23" → "11월 23일"
const monthDay = (dateString) => {
  const [, month, day] = dateString.split('-').map(Number);
  return `${month}월 ${day}일`;
};

const weekTitle = (offset) => (offset === 0 ? '이번 주' : offset === 1 ? '지난주' : `${offset}주 전`);

export default function WeeklyChartCard({ weekly, weekOffset, onPrev, onNext }) {
  const todayString = toDateString(new Date());

  // 그래프 높이의 기준(위쪽 끝): 가장 많이 한 날과 목표 중 큰 값을 1시간 단위로 올림 (최소 1시간)
  const goalSeconds = weekly ? weekly.goalSeconds : null;
  const hasGoal = goalSeconds !== null && goalSeconds !== undefined;
  const maxDay = weekly ? Math.max(0, ...weekly.days.map((day) => day.totalSeconds)) : 0;
  const scaleMax = Math.ceil(Math.max(maxDay, hasGoal ? goalSeconds : 0, 3600) / 3600) * 3600;
  const percent = (seconds) => (seconds / scaleMax) * 100;

  return (
    <section className="panel study-panel">
      <div className="study-panel-head">
        <div className="study-panel-title">
          <div className="panel-icon"><TrendingUp size={19} /></div>
          <h2>{weekTitle(weekOffset)} 공부 시간</h2>
        </div>
        <div className="study-week-nav">
          <button type="button" className="study-icon-button" onClick={onPrev} aria-label="이전 주">
            <ChevronLeft size={17} />
          </button>
          <span className="study-week-range">
            {weekly ? `${monthDay(weekly.startDate)} ~ ${monthDay(weekly.endDate)}` : ''}
          </span>
          <button type="button" className="study-icon-button" onClick={onNext} disabled={weekOffset === 0} aria-label="다음 주">
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      {!weekly ? (
        <p className="study-empty">불러오는 중이에요...</p>
      ) : (
        <>
          <div className="study-week-plot">
            {hasGoal && (
              <div className="study-week-goal" style={{ bottom: `${percent(goalSeconds)}%` }}>
                <span>목표 {formatDuration(goalSeconds)}</span>
              </div>
            )}

            {weekly.days.map((day) => {
              const reached = hasGoal && day.totalSeconds >= goalSeconds;
              const isToday = day.date === todayString;
              return (
                <div
                  className="study-week-col"
                  key={day.date}
                  title={`${monthDay(day.date)} (${day.dayLabel}) · ${day.totalSeconds > 0 ? formatDuration(day.totalSeconds) : '기록 없음'}`}
                >
                  {day.totalSeconds > 0 && (
                    <span className="study-week-value" style={{ bottom: `calc(${percent(day.totalSeconds)}% + 4px)` }}>
                      {formatShort(day.totalSeconds)}
                    </span>
                  )}
                  <div
                    className={`study-week-bar ${isToday ? 'is-today' : ''} ${reached ? 'is-reached' : ''}`}
                    style={{ height: `${percent(day.totalSeconds)}%`, minHeight: day.totalSeconds > 0 ? '3px' : 0 }}
                  />
                </div>
              );
            })}
          </div>

          <div className="study-week-days">
            {weekly.days.map((day) => (
              <span key={day.date} className={day.date === todayString ? 'is-today' : ''}>{day.dayLabel}</span>
            ))}
          </div>

          <div className="study-week-summary">
            <span>합계 {weekly.totalSeconds > 0 ? formatDuration(weekly.totalSeconds) : '0분'}</span>
            <span>공부한 날 {weekly.studiedDays}일</span>
            {weekly.achievedDays !== null && weekly.achievedDays !== undefined && (
              <span>목표 달성 {weekly.achievedDays}일</span>
            )}
          </div>
        </>
      )}
    </section>
  );
}