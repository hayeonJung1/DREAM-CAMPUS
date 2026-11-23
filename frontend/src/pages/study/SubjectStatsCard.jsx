import { BookOpen } from 'lucide-react';
import { formatDuration } from '../../utils/formatTime.js';

const RANGES = [
  { id: 'week', label: '이번 주' },
  { id: 'month', label: '이번 달' },
  { id: 'all', label: '전체' },
];

export default function SubjectStatsCard({ subjects, range, onChangeRange }) {
  // 가장 많이 한 과목을 100% 폭으로 두고 나머지를 비교해서 보여준다
  const maxSeconds = subjects ? Math.max(0, ...subjects.map((s) => s.totalSeconds)) : 0;

  return (
    <section className="panel study-panel">
      <div className="study-panel-head">
        <div className="study-panel-title">
          <div className="panel-icon"><BookOpen size={19} /></div>
          <h2>과목별 누적 시간</h2>
        </div>
      </div>

      <div className="study-range-row" role="radiogroup" aria-label="기간">
        {RANGES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={range === item.id}
            className={`study-chip ${range === item.id ? 'is-selected' : ''}`}
            onClick={() => onChangeRange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!subjects ? (
        <p className="study-empty">불러오는 중이에요...</p>
      ) : subjects.length === 0 ? (
        <p className="study-empty">이 기간에는 공부 기록이 없어요. 타이머로 공부를 시작해 보세요.</p>
      ) : (
        <ul className="study-subject-stat-list">
          {subjects.map((subject) => (
            <li className="study-subject-stat" key={subject.subjectName}>
              <div className="study-subject-stat-head">
                <span>{subject.subjectName}</span>
                <span>{formatDuration(subject.totalSeconds)} · {subject.percent}%</span>
              </div>
              <div className="study-subject-stat-track">
                <div
                  className="study-subject-stat-fill"
                  style={{ width: `${maxSeconds ? (subject.totalSeconds / maxSeconds) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}