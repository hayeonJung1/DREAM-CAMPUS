import { useState } from 'react';
import { BookOpen, Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useStudyApi } from './StudyApiContext';

const MAX_NAME_LENGTH = 30;

export default function SubjectManager({ subjects, setSubjects, loading }) {
  const api = useStudyApi();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);       // 요청 중에는 버튼을 막아 중복 요청 방지
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

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
    event.preventDefault();
    const name = newName.trim();
    if (!name) {
      setError('과목 이름을 입력해 주세요.');
      return;
    }
    await run(async () => {
      const created = await api.createSubject(name);
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
    if (name === subject.name) {
      cancelEdit();
      return;
    }
    const ok = await run(async () => {
      const updated = await api.renameSubject(subject.studySubjectId, name);
      setSubjects((prev) => prev.map((s) => (s.studySubjectId === updated.studySubjectId ? updated : s)));
    });
    if (ok) cancelEdit();
  };

  const handleDelete = async (subject) => {
    if (!window.confirm(`'${subject.name}' 과목을 삭제할까요?\n이 과목으로 기록한 공부 시간은 그대로 남아요.`)) return;
    await run(async () => {
      await api.deleteSubject(subject.studySubjectId);
      setSubjects((prev) => prev.filter((s) => s.studySubjectId !== subject.studySubjectId));
    });
  };

  return (
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
  );
}