import { useEffect, useState } from 'react';
import { BookOpen, Check, ChevronRight, Clock3, Pencil, Plus, Trash2, X } from 'lucide-react';
import { createSubject, deleteSubject, getSubjects, renameSubject } from '../../api/studyApi';
import './StudyPage.css';

const MAX_NAME_LENGTH = 30;

export default function StudyPage() {
  const [subjects, setSubjects] = useState([]);   // 서버에서 받은 내 과목 목록
  const [loading, setLoading] = useState(true);   // 처음 불러오는 중인지
  const [error, setError] = useState('');         // 화면에 보여줄 에러 메시지
  const [busy, setBusy] = useState(false);        // 요청 중이면 true → 버튼을 막아 중복 요청 방지
  const [newName, setNewName] = useState('');     // 추가 입력창의 값
  const [editingId, setEditingId] = useState(null);   // 지금 이름을 고치는 중인 과목 번호
  const [editingName, setEditingName] = useState('');

  // 화면이 처음 나타날 때 목록을 한 번 불러온다
  useEffect(() => {
    let ignore = false;   // 화면이 사라진 뒤 도착한 응답은 무시하기 위한 표시
    getSubjects()
      .then((data) => { if (!ignore) setSubjects(data); })
      .catch((e) => { if (!ignore) setError(e.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  // 요청 하나를 실행하는 공통 처리: busy 켜기 → 실행 → 에러면 메시지 표시 → busy 끄기
  const run = async (action) => {
    setBusy(true);
    setError('');
    try {
      await action();
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();   // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막는다
    const name = newName.trim();
    if (!name) {
      setError('과목 이름을 입력해 주세요.');
      return;
    }
    await run(async () => {
      const created = await createSubject(name);
      // 숨겨 뒀던 과목이 되살아난 경우를 포함해, 서버 정렬(번호순)과 같게 맞춘다
      setSubjects((prev) =>
        [...prev.filter((s) => s.studySubjectId !== created.studySubjectId), created]
          .sort((a, b) => a.studySubjectId - b.studySubjectId),
      );
      setNewName('');
    });
  };

  const startEdit = (subject) => {
    setEditingId(subject.studySubjectId);
    setEditingName(subject.name);
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async (subject) => {
    const name = editingName.trim();
    if (!name) {
      setError('과목 이름을 입력해 주세요.');
      return;
    }
    if (name === subject.name) {   // 바뀐 게 없으면 서버에 보내지 않는다
      cancelEdit();
      return;
    }
    const ok = await run(async () => {
      const updated = await renameSubject(subject.studySubjectId, name);
      setSubjects((prev) => prev.map((s) => (s.studySubjectId === updated.studySubjectId ? updated : s)));
    });
    if (ok) cancelEdit();   // 실패하면 입력창을 그대로 두고 다시 고칠 수 있게 한다
  };

  const handleDelete = async (subject) => {
    if (!window.confirm(`'${subject.name}' 과목을 삭제할까요?\n이 과목으로 기록한 공부 시간은 그대로 남아요.`)) return;
    await run(async () => {
      await deleteSubject(subject.studySubjectId);
      setSubjects((prev) => prev.filter((s) => s.studySubjectId !== subject.studySubjectId));
    });
  };

  return (
    <div className="page-content subpage-content">
      <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> 공부 타이머</div>

      <section className="subpage-hero">
        <div className="subpage-icon"><Clock3 size={30} /></div>
        <div>
          <span className="eyebrow">STUDY TIMER</span>
          <h1>공부 타이머</h1>
          <p>공부할 과목을 정하고 시간을 기록해요. 먼저 내 공부 과목을 관리해 볼까요?</p>
        </div>
      </section>

      <section className="panel study-panel">
        <div className="study-panel-head">
          <div className="study-panel-title">
            <div className="panel-icon"><BookOpen size={19} /></div>
            <h2>내 공부 과목</h2>
          </div>
          {!loading && <span className="study-count">{subjects.length}개</span>}
        </div>

        <form className="study-add-form" onSubmit={handleAdd}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            placeholder="새 과목 이름 (예: 토익, 독서, 운동)"
            disabled={busy}
          />
          <button type="submit" className="primary-button" disabled={busy}>
            <Plus size={15} /> 추가
          </button>
        </form>

        {error && <p className="study-error" role="alert">{error}</p>}

        {loading ? (
          <p className="study-empty">불러오는 중이에요...</p>
        ) : subjects.length === 0 ? (
          <p className="study-empty">아직 과목이 없어요. 위에서 첫 과목을 추가해 보세요.</p>
        ) : (
          <ul className="study-subject-list">
            {subjects.map((subject) => (
              <li className="study-subject-row" key={subject.studySubjectId}>
                <span className="study-subject-dot" />
                {editingId === subject.studySubjectId ? (
                  <>
                    <input
                      className="study-edit-input"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(subject);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      maxLength={MAX_NAME_LENGTH}
                      autoFocus
                      disabled={busy}
                    />
                    <button className="study-icon-button" onClick={() => saveEdit(subject)} disabled={busy} aria-label="저장">
                      <Check size={16} />
                    </button>
                    <button className="study-icon-button" onClick={cancelEdit} disabled={busy} aria-label="취소">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="study-subject-name">{subject.name}</span>
                    <button className="study-icon-button" onClick={() => startEdit(subject)} disabled={busy} aria-label="이름 수정">
                      <Pencil size={15} />
                    </button>
                    <button className="study-icon-button danger" onClick={() => handleDelete(subject)} disabled={busy} aria-label="삭제">
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}