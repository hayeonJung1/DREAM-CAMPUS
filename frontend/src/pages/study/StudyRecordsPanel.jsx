import { useEffect, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useStudyApi } from './StudyApiContext.js';
import {
  addDays,
  formatDateLabel,
  formatDuration,
  formatTimeOfDay,
  parseDateString,
  toDateString,
} from '../../utils/formatTime.js';

const STATUS_LABEL = { RUNNING: '공부 중', PAUSED: '일시정지' };

// 시작한 날과 끝난 날이 다르면(자정을 넘긴 공부) "다음날"을 붙여준다
const endLabel = (record) => {
  if (!record.endedAt) return STATUS_LABEL[record.status] ?? '진행 중';
  const nextDay = record.endedAt.slice(0, 10) !== record.startedAt.slice(0, 10);
  return `${nextDay ? '다음날 ' : ''}${formatTimeOfDay(record.endedAt)}`;
};

export default function StudyRecordsPanel() {
  const api = useStudyApi();
  const today = toDateString(new Date());

  const [date, setDate] = useState(today);
  const [records, setRecords] = useState(null);       // null 이면 불러오는 중
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);         // 삭제 요청 중인 기록 번호
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setRecords(null);
    api
      .getSessions(date, date)
      .then((data) => {
        if (ignore) return;
        setRecords(data);
        setError('');
      })
      .catch((e) => {
        if (ignore) return;
        setRecords([]);
        setError(e.status === 401 ? '로그인 정보가 만료됐어요. 새로고침해 주세요.' : e.message);
      });
    return () => {
      ignore = true;
    };
  }, [api, date, reloadKey]);

  const moveDay = (delta) => setDate(toDateString(addDays(parseDateString(date), delta)));

  const handleDelete = async (record) => {
    const name = record.studySubjectName ?? '자유 공부';
    if (!window.confirm(`${name} ${formatDuration(record.elapsedSeconds)} 기록을 삭제할까요?\n삭제하면 통계에서도 빠져요.`)) return;
    setBusyId(record.sessionId);
    setError('');
    try {
      await api.deleteSession(record.sessionId);
      setReloadKey((key) => key + 1);
    } catch (e) {
      setError(e.message);
      setReloadKey((key) => key + 1);   // 이미 지워졌거나 상태가 바뀌었을 수 있으니 목록을 다시 맞춘다
    } finally {
      setBusyId(null);
    }
  };

  const totalSeconds = records ? records.reduce((sum, r) => sum + r.elapsedSeconds, 0) : 0;

  return (
    <section className="panel study-panel">
      <div className="study-panel-head">
        <div className="study-panel-title">
          <div className="panel-icon"><CalendarDays size={19} /></div>
          <h2>공부 기록</h2>
        </div>
        {date !== today && (
          <button type="button" className="study-small-button" onClick={() => setDate(today)}>오늘</button>
        )}
      </div>

      <div className="study-date-nav">
        <button type="button" className="study-icon-button" onClick={() => moveDay(-1)} aria-label="전날">
          <ChevronLeft size={17} />
        </button>
        <label className="study-date-label">
          <span>{formatDateLabel(date)}</span>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            aria-label="날짜 선택"
          />
        </label>
        <button
          type="button"
          className="study-icon-button"
          onClick={() => moveDay(1)}
          disabled={date >= today}
          aria-label="다음날"
        >
          <ChevronRight size={17} />
        </button>
      </div>

      {error && <p className="study-error" role="alert">{error}</p>}

      {records === null ? (
        <p className="study-empty">불러오는 중이에요...</p>
      ) : records.length === 0 ? (
        <p className="study-empty">이 날은 공부 기록이 없어요.</p>
      ) : (
        <>
          <p className="study-record-total">
            이 날 공부 <strong>{formatDuration(totalSeconds)}</strong> · {records.length}번
          </p>

          <ul className="study-record-list">
            {records.map((record) => (
              <li className="study-record-row" key={record.sessionId}>
                <div className="study-record-time">
                  <strong>{formatTimeOfDay(record.startedAt)}</strong>
                  <span className={record.endedAt ? '' : 'is-live'}>{endLabel(record)}</span>
                </div>

                <div className="study-record-main">
                  <span className="study-record-subject">{record.studySubjectName ?? '자유 공부'}</span>
                  <span className="study-record-meta">
                    {formatDuration(record.elapsedSeconds)}
                    {record.totalPausedSeconds > 0 && ` · 쉼 ${formatDuration(record.totalPausedSeconds)}`}
                  </span>
                </div>

                {record.endedAt ? (
                  <button
                    type="button"
                    className="study-icon-button danger"
                    onClick={() => handleDelete(record)}
                    disabled={busyId === record.sessionId}
                    aria-label="기록 삭제"
                  >
                    <Trash2 size={15} />
                  </button>
                ) : (
                  <span className="study-status study-status-running">{STATUS_LABEL[record.status]}</span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}