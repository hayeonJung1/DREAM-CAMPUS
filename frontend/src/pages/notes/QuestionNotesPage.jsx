import React, { useCallback, useEffect, useState } from 'react';
import QuestionNoteEditor from '../../components/exam/QuestionNoteEditor.jsx';

function getPreview(html) {
  const document = new DOMParser().parseFromString(html || '', 'text/html');
  return document.body.innerText || '아직 작성된 내용이 없습니다.';
}

export default function QuestionNotesPage() {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/exams/notes', {
        credentials: 'same-origin',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || '오답노트를 불러오지 못했습니다.');
      }

      setNotes(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setError(error.message || '오답노트를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const deleteNote = async (note) => {
  const confirmed = window.confirm(
    `${note.subjectName} ${note.questionNumber}번 오답노트를 삭제하시겠습니까?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`/api/exams/notes/${note.id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || '오답노트를 삭제하지 못했습니다.');
    }

    setNotes((previous) => previous.filter((item) => item.id !== note.id));

    if (editingNote?.id === note.id) {
      setEditingNote(null);
    }
  } catch (error) {
    window.alert(error.message || '삭제 중 오류가 발생했습니다.');
  }
};

  const bookmarkedCount = notes.filter((note) => note.bookmarked).length;

  const visibleNotes = filter === 'bookmarked'
    ? notes.filter((note) => note.bookmarked)
    : notes;

  return (
    <div className="page-content subpage-content">
      <section style={{ marginBottom: 28 }}>
        <span className="eyebrow">MY STUDY NOTES</span>
        <h1 style={{ margin: '10px 0' }}>나의 오답노트</h1>
        <p style={{ color: '#888', lineHeight: 1.7 }}>
          틀린 문제를 기록하고 복습하면서 나만의 학습 자료를 만들어 보세요.
        </p>
      </section>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 14,
        marginBottom: 24,
      }}>
        <div style={{
          padding: 22,
          borderRadius: 14,
          background: '#f7f2f6',
        }}>
          <span style={{ color: '#89758a', fontSize: 13 }}>전체 오답노트</span>
          <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>{notes.length}개</h2>
        </div>

        <div style={{
          padding: 22,
          borderRadius: 14,
          background: '#f2f5f1',
        }}>
          <span style={{ color: '#758b78', fontSize: 13 }}>북마크한 문제</span>
          <h2 style={{ margin: '8px 0 0', fontSize: 28 }}>{bookmarkedCount}개</h2>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 20,
      }}>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className="mock-secondary-button"
          style={{
            background: filter === 'all' ? '#eee5ed' : '#fff',
          }}
        >
          전체 오답노트
        </button>

        <button
          type="button"
          onClick={() => setFilter('bookmarked')}
          className="mock-secondary-button"
          style={{
            background: filter === 'bookmarked' ? '#eee5ed' : '#fff',
          }}
        >
          북마크
        </button>
      </div>

      {loading ? (
        <p>오답노트를 불러오는 중입니다.</p>
      ) : error ? (
        <div role="alert" style={{ padding: 20, color: '#b14d59' }}>
          {error}
          <button type="button" onClick={loadNotes}>다시 불러오기</button>
        </div>
      ) : visibleNotes.length === 0 ? (
        <div style={{
          padding: 48,
          textAlign: 'center',
          border: '1px solid #eee6ed',
          borderRadius: 16,
          background: '#fff',
        }}>
          <h3>아직 저장된 오답노트가 없어요.</h3>
          <p style={{ color: '#999', fontSize: 14 }}>
            모의고사 채점 결과에서 오답노트를 작성해 보세요.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}>
          {visibleNotes.map((note) => (
            <article
              key={note.id}
              style={{
                border: '1px solid #eee6ed',
                borderRadius: 16,
                padding: 20,
                background: '#fff',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
                marginBottom: 14,
              }}>
                <span style={{ fontSize: 12, color: '#977b96' }}>
                  {note.academicYear} · {note.examMonth}월
                </span>

                {note.bookmarked && (
                  <span style={{ color: '#ae8299', fontSize: 12 }}>
                    ★ 북마크
                  </span>
                )}
              </div>

              <h3 style={{ margin: '0 0 6px' }}>
                {note.subjectName}
              </h3>

              <p style={{ margin: '0 0 12px', color: '#888', fontSize: 13 }}>
                {note.optionName || '필수 영역'} · {note.questionNumber}번
              </p>

              <p style={{
                minHeight: 65,
                color: '#666',
                fontSize: 13,
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
                overflowWrap: 'anywhere',
              }}>
                {getPreview(note.contentHtml).slice(0, 110)}
              </p>

             <div style={{
  display: 'flex',
  gap: 8,
  marginTop: 12,
}}>
  <button
    type="button"
    className="mock-secondary-button"
    style={{ flex: 1, minWidth: 0 }}
    onClick={() => setEditingNote(note)}
  >
    수정하기
  </button>

  <button
    type="button"
    className="mock-secondary-button"
    style={{
      flex: 1,
      minWidth: 0,
      color: '#a14f5a',
      borderColor: '#ead4d8',
      background: '#fff8f8',
    }}
    onClick={() => deleteNote(note)}
  >
    삭제하기
  </button>
</div>
            </article>
          ))}
        </div>
      )}

      {editingNote && (
        <QuestionNoteEditor
          examSubjectId={editingNote.examSubjectId}
          questionNumber={editingNote.questionNumber}
          subjectLabel={editingNote.subjectName}
          onClose={() => setEditingNote(null)}
          onSaved={loadNotes}
        />
      )}
    </div>
  );
}