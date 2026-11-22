import { Pause, Play, Square, Timer } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer.js';
import { formatClock, formatDuration } from '../../utils/formatTime.js';

const STATUS_LABEL = { IDLE: '대기 중', RUNNING: '공부 중', PAUSED: '일시정지' };

export default function StudyTimerPanel({
  subjects,
  session,             // 진행 중인 세션 (없으면 null)
  selectedSubjectId,   // 시작할 과목 (null 이면 자유 공부)
  onSelectSubject,
  onStart,
  onPause,
  onResume,
  onStop,
  busy,
  loading,
  lastResult,          // 방금 끝낸 세션 (결과 안내용)
}) {
  const seconds = useTimer(session);
  const status = session ? session.status : 'IDLE';
  const locked = busy || session !== null;   // 공부 중에는 과목을 바꿀 수 없다

  return (
    <section className="panel study-panel study-timer-panel">
      <div className="study-panel-head">
        <div className="study-panel-title">
          <div className="panel-icon"><Timer size={19} /></div>
          <h2>공부 시간 기록</h2>
        </div>
        <span className={`study-status study-status-${status.toLowerCase()}`}>{STATUS_LABEL[status]}</span>
      </div>

      <div className={`study-clock ${status === 'PAUSED' ? 'is-paused' : ''}`}>{formatClock(seconds)}</div>

      {session ? (
        <p className="study-clock-sub">{session.studySubjectName ?? '자유 공부'}</p>
      ) : (
        <p className="study-clock-sub">과목을 고르고 시작을 눌러 주세요</p>
      )}

      <div className="study-chip-row" role="radiogroup" aria-label="공부 과목">
        <button
          type="button"
          role="radio"
          aria-checked={(session ? session.studySubjectId : selectedSubjectId) === null}
          className={`study-chip ${(session ? session.studySubjectId : selectedSubjectId) === null ? 'is-selected' : ''}`}
          onClick={() => onSelectSubject(null)}
          disabled={locked}
        >
          자유 공부
        </button>
        {subjects.map((subject) => {
          const selected = (session ? session.studySubjectId : selectedSubjectId) === subject.studySubjectId;
          return (
            <button
              key={subject.studySubjectId}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`study-chip ${selected ? 'is-selected' : ''}`}
              onClick={() => onSelectSubject(subject.studySubjectId)}
              disabled={locked}
            >
              {subject.name}
            </button>
          );
        })}
      </div>

      <div className="study-timer-actions">
        {status === 'IDLE' && (
          <button type="button" className="primary-button" onClick={onStart} disabled={busy || loading}>
            <Play size={16} /> 시작
          </button>
        )}
        {status === 'RUNNING' && (
          <button type="button" className="study-action-secondary" onClick={onPause} disabled={busy}>
            <Pause size={16} /> 일시정지
          </button>
        )}
        {status === 'PAUSED' && (
          <button type="button" className="primary-button" onClick={onResume} disabled={busy}>
            <Play size={16} /> 이어서 공부
          </button>
        )}
        {status !== 'IDLE' && (
          <button type="button" className="study-action-stop" onClick={onStop} disabled={busy}>
            <Square size={15} /> 종료
          </button>
        )}
      </div>

      {lastResult && !session && (
        <p className="study-result">
          수고했어요! <strong>{lastResult.studySubjectName ?? '자유 공부'}</strong>{' '}
          {formatDuration(lastResult.elapsedSeconds)} 공부했어요.
        </p>
      )}
    </section>
  );
}