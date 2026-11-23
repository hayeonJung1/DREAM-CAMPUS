import { useState } from 'react';
import { Check, Target } from 'lucide-react';
import { formatClock, formatMinutes } from '../../utils/formatTime.js';

const GOAL_PRESETS = [60, 120, 180, 240, 300, 360];   // 분

export default function TodaySummaryCard({ daily, onSaveGoal }) {
  const [editing, setEditing] = useState(false);
  const [minutes, setMinutes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const goalMinutes = daily.goalSeconds ? Math.round(daily.goalSeconds / 60) : null;
  const rate = daily.achievementRate;                       // 목표가 없으면 null
  const hasGoal = rate !== null && rate !== undefined;
  const achieved = hasGoal && rate >= 100;

  const openEditor = () => {
    setMinutes(goalMinutes ? String(goalMinutes) : '');
    setError('');
    setEditing(true);
  };

  // value 가 null 이면 목표 해제
  const save = async (value) => {
    setSaving(true);
    setError('');
    try {
      await onSaveGoal(value);
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = Number(minutes);
    if (!Number.isInteger(value) || value < 1 || value > 1440) {
      setError('목표 시간은 1분 이상 1440분(24시간) 이하의 숫자로 입력해 주세요.');
      return;
    }
    save(value);
  };

  return (
    <section className="panel study-panel">
      <div className="study-panel-head">
        <div className="study-panel-title">
          <div className="panel-icon"><Target size={19} /></div>
          <h2>오늘의 공부</h2>
        </div>
        {daily.activeSeconds > 0 && (
          <span className="study-status study-status-running">공부 중인 시간 포함</span>
        )}
      </div>

      <div className="study-today-time">{formatClock(daily.totalSeconds)}</div>
      <p className="study-today-sub">
        {daily.sessionCount > 0 ? `오늘 ${daily.sessionCount}번 공부했어요` : '오늘은 아직 공부 기록이 없어요'}
      </p>

      {hasGoal ? (
        <>
          <div className="study-goal-row">
            <span>하루 목표 {formatMinutes(goalMinutes)}</span>
            <strong>{rate}%</strong>
          </div>
          <div
            className="study-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(rate, 100)}
          >
            <div
              className={`study-progress-fill ${achieved ? 'is-done' : ''}`}
              style={{ width: `${Math.min(rate, 100)}%` }}
            />
          </div>
          {achieved && (
            <p className="study-goal-note"><Check size={13} /> 오늘 목표를 달성했어요!</p>
          )}
        </>
      ) : (
        <p className="study-goal-note">하루 목표를 정하면 달성률을 볼 수 있어요.</p>
      )}

      {!editing && (
        <button type="button" className="study-link-button" onClick={openEditor}>
          {hasGoal ? '목표 수정' : '목표 정하기'}
        </button>
      )}

      {editing && (
        <div className="study-goal-editor">
          <div className="study-goal-presets">
            {GOAL_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`study-chip ${Number(minutes) === preset ? 'is-selected' : ''}`}
                onClick={() => setMinutes(String(preset))}
                disabled={saving}
              >
                {formatMinutes(preset)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="number"
              min="1"
              max="1440"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="직접 입력 (분)"
              disabled={saving}
            />
            <button type="submit" className="primary-button" disabled={saving}>저장</button>
            <button type="button" className="study-small-button" onClick={() => setEditing(false)} disabled={saving}>
              취소
            </button>
          </form>

          {goalMinutes !== null && (
            <button type="button" className="study-link-button" onClick={() => save(null)} disabled={saving}>
              목표 해제
            </button>
          )}
          {error && <p className="study-error" role="alert">{error}</p>}
        </div>
      )}
    </section>
  );
}