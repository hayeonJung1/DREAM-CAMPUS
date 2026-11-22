import { useEffect, useState } from 'react';
import { ChevronRight, Clock3 } from 'lucide-react';
import {
  getActiveSession,
  getSubjects,
  pauseSession,
  resumeSession,
  startSession,
  stopSession,
} from '../../api/studyApi.js';
import StudyTimerPanel from './StudyTimerPanel.jsx';
import SubjectManager from './SubjectManager.jsx';
import './StudyPage.css';

// 서버 응답에 "화면이 받은 시각"을 붙인다 (useTimer 가 이어서 셀 때 기준으로 쓴다)
const withSyncTime = (response) => ({ ...response, syncedAt: Date.now() });

export default function StudyPage() {
  const [subjects, setSubjects] = useState([]);
  const [session, setSession] = useState(null);                 // 진행 중인 세션
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [lastResult, setLastResult] = useState(null);           // 방금 끝낸 세션
  const [loading, setLoading] = useState(true);
  const [needLogin, setNeedLogin] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // 처음 열 때: 내 과목과 진행 중인 세션을 함께 불러온다 (새로고침해도 이어서 보이게)
  useEffect(() => {
    let ignore = false;
    Promise.all([getSubjects(), getActiveSession()])
      .then(([subjectList, active]) => {
        if (ignore) return;
        setSubjects(subjectList);
        if (active) {
          setSession(withSyncTime(active));
          setSelectedSubjectId(active.studySubjectId ?? null);
        }
      })
      .catch((e) => {
        if (ignore) return;
        if (e.status === 401) setNeedLogin(true);
        else setError(e.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // 선택한 과목이 삭제돼서 목록에 없으면 자유 공부로 되돌린다
  const effectiveSubjectId = subjects.some((s) => s.studySubjectId === selectedSubjectId)
    ? selectedSubjectId
    : null;

  // 다른 탭에서 상태가 바뀌었을 수 있으므로, 충돌이 나면 서버 상태로 화면을 다시 맞춘다
  const resync = async () => {
    try {
      const active = await getActiveSession();
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
      setSession(withSyncTime(await startSession(effectiveSubjectId)));
    });

  const handlePause = () =>
    runTimerAction(async () => {
      setSession(withSyncTime(await pauseSession(session.sessionId)));
    });

  const handleResume = () =>
    runTimerAction(async () => {
      setSession(withSyncTime(await resumeSession(session.sessionId)));
    });

  const handleStop = () =>
    runTimerAction(async () => {
      const stopped = await stopSession(session.sessionId);
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
          <p className="study-empty">로그인이 필요해요. 로그인한 뒤에 다시 열어 주세요.</p>
        </section>
      ) : (
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
            loading={loading}
            lastResult={lastResult}
          />

          <SubjectManager subjects={subjects} setSubjects={setSubjects} loading={loading} />
        </>
      )}
    </div>
  );
}