import { useEffect, useState } from 'react';
import { ChevronRight, Clock3, Info, Timer, TrendingUp } from 'lucide-react';
import * as serverApi from '../../api/studyApi.js';
import * as guestApi from '../../api/guestStudyApi.js';
import { StudyApiContext } from './StudyApiContext.js';
import StudyStatsPanel from './StudyStatsPanel.jsx';
import StudyTimerPanel from './StudyTimerPanel.jsx';
import SubjectManager from './SubjectManager.jsx';
import './StudyPage.css';

// 서버 응답에 "화면이 받은 시각"을 붙인다 (useTimer 가 이어서 셀 때 기준으로 쓴다)
const withSyncTime = (response) => ({ ...response, syncedAt: Date.now() });

export default function StudyPage() {
  const [mode, setMode] = useState(null);            // null: 확인 중, 'server': 로그인함, 'guest': 비로그인
  const [tab, setTab] = useState('timer');           // 'timer' | 'stats'
  const [subjects, setSubjects] = useState([]);
  const [session, setSession] = useState(null);      // 진행 중인 세션
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false); // 로그인해서 쓰던 중에 로그인이 풀린 경우
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // 지금 쓸 API: 비로그인이면 브라우저 저장소, 그 외에는 서버
  const api = mode === 'guest' ? guestApi : serverApi;

  // 처음 열 때: 서버에 먼저 물어서 로그인 여부를 판단하고, 과목과 진행 중인 세션을 불러온다
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        let currentApi = serverApi;
        let guest = false;
        let active;
        try {
          active = await serverApi.getActiveSession();
        } catch (e) {
          if (e.status !== 401) throw e;   // 401 이 아니면 진짜 오류
          guest = true;                    // 401 = 로그인하지 않음 → 브라우저 저장소로 계속
          currentApi = guestApi;
          active = await guestApi.getActiveSession();
        }
        const subjectList = await currentApi.getSubjects();
        if (ignore) return;

        setMode(guest ? 'guest' : 'server');
        setSubjects(subjectList);
        if (active) {
          setSession(withSyncTime(active));
          setSelectedSubjectId(active.studySubjectId ?? null);
        }
      } catch (e) {
        if (!ignore) setError(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // 선택한 과목이 삭제돼서 목록에 없으면 자유 공부로 되돌린다
  const effectiveSubjectId = subjects.some((s) => s.studySubjectId === selectedSubjectId)
    ? selectedSubjectId
    : null;

  // 다른 탭에서 상태가 바뀌었을 수 있으므로, 충돌이 나면 저장된 상태로 화면을 다시 맞춘다
  const resync = async () => {
    try {
      const active = await api.getActiveSession();
      setSession(active ? withSyncTime(active) : null);
    } catch {
      /* 다시 맞추지 못해도 에러 메시지는 이미 보여준 상태 */
    }
  };

  // 타이머 요청 하나를 실행하는 공통 처리
  const runTimerAction = async (action) => {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (e) {
      if (e.status === 401) {
        setNeedLogin(true);
        return;
      }
      setError(e.message);
      if (e.status === 409 || e.status === 404) await resync();
    } finally {
      setBusy(false);
    }
  };

  const handleStart = () =>
    runTimerAction(async () => {
      setLastResult(null);
      setSession(withSyncTime(await api.startSession(effectiveSubjectId)));
    });

  const handlePause = () =>
    runTimerAction(async () => {
      setSession(withSyncTime(await api.pauseSession(session.sessionId)));
    });

  const handleResume = () =>
    runTimerAction(async () => {
      setSession(withSyncTime(await api.resumeSession(session.sessionId)));
    });

  const handleStop = () =>
    runTimerAction(async () => {
      const stopped = await api.stopSession(session.sessionId);
      setLastResult(withSyncTime(stopped));
      setSession(null);
    });

  return (
    <div className="page-content subpage-content">
      <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> 공부 타이머</div>

      <section className="subpage-hero">
        <div className="subpage-icon"><Clock3 size={30} /></div>
        <div>
          <span className="eyebrow">STUDY TIMER</span>
          <h1>공부 타이머</h1>
          <p>공부할 과목을 고르고 시간을 기록해요. 일시정지해도 쉰 시간은 빼고 계산해요.</p>
        </div>
      </section>

      {needLogin ? (
        <section className="panel study-panel">
          <p className="study-empty">로그인 정보가 만료됐어요. 다시 로그인하거나, 로그인 없이 계속할 수 있어요.</p>
          <div className="study-timer-actions">
            <button type="button" className="primary-button" onClick={() => window.location.reload()}>
              로그인 없이 계속하기
            </button>
          </div>
        </section>
      ) : (
        <StudyApiContext.Provider value={api}>
          {mode === 'guest' && (
            <p className="study-guest-notice" role="status">
              <Info size={14} />
              <span>
                로그인하지 않은 상태예요. 공부 기록은 <strong>이 브라우저에만</strong> 저장되고,
                브라우저 데이터를 지우면 사라져요. 로그인하면 기록이 내 계정에 저장돼요.
              </span>
            </p>
          )}

          <div className="study-tabs" role="tablist" aria-label="공부 타이머 메뉴">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'timer'}
              className={`study-tab ${tab === 'timer' ? 'is-active' : ''}`}
              onClick={() => setTab('timer')}
            >
              <Timer size={15} /> 타이머
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'stats'}
              className={`study-tab ${tab === 'stats' ? 'is-active' : ''}`}
              onClick={() => setTab('stats')}
            >
              <TrendingUp size={15} /> 통계
            </button>
          </div>

          {tab === 'timer' ? (
            <>
              {error && <p className="study-error" role="alert">{error}</p>}

              <StudyTimerPanel
                subjects={subjects}
                session={session}
                selectedSubjectId={effectiveSubjectId}
                onSelectSubject={setSelectedSubjectId}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onStop={handleStop}
                busy={busy}
                loading={loading || mode === null}
                lastResult={lastResult}
              />

              <SubjectManager subjects={subjects} setSubjects={setSubjects} loading={loading} />
            </>
          ) : (
            mode !== null && <StudyStatsPanel />
          )}
        </StudyApiContext.Provider>
      )}
    </div>
  );
}