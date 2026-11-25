
import React, { useEffect, useState } from 'react';
import './QuestionNoteEditor.css';

const NOTE_SECTIONS = [
  { key: 'concept', label: '핵심 개념', placeholder: '문제와 관련된 핵심 개념을 정리해 보세요.' },
  { key: 'reason', label: '틀린 이유', placeholder: ' 잘못 이해한 부분 적어 보세요.' },
  { key: 'memo', label: '나만의 메모', placeholder: '다음에 기억해야 할 내용이나 추가 풀이를 적어 보세요.' },
];

const emptySections = () => ({
  concept: '',
  vocabulary: '',
  reason: '',
  memo: '',
});

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function htmlToSections(html) {
  const document = new DOMParser().parseFromString(html || '', 'text/html');
  const sections = emptySections();
  const headings = Array.from(document.querySelectorAll('h3'));

  if (headings.length === 0) {
    sections.memo = document.body.innerText || document.body.textContent || '';
    return sections;
  }

  headings.forEach((heading) => {
    const section = NOTE_SECTIONS.find(
      (item) => item.label === heading.textContent.trim()
    );

    if (!section) return;

    const content = heading.nextElementSibling;
    sections[section.key] = content
      ? (content.innerText || content.textContent || '').trim()
      : '';
  });

  return sections;
}

function sectionsToHtml(sections) {
  return NOTE_SECTIONS.map(({ key, label }) => {
    const content = escapeHtml(sections[key] || '')
      .replace(/\r?\n/g, '<br>');

    return `<h3>${label}</h3><p>${content}</p>`;
  }).join('');
}

export default function QuestionNoteEditor({
  examSubjectId,
  questionNumber,
  subjectLabel,
  onClose,
  onSaved,
}) {
  const [sections, setSections] = useState(emptySections);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    fetch(`/api/exams/${examSubjectId}/questions/${questionNumber}/note`, {
      credentials: 'same-origin',
    })
      .then((response) => response.json())
      .then((result) => {
        if (!result.success) {
          throw new Error(result.message || '오답노트를 불러오지 못했습니다.');
        }

        if (!active) return;

        setSections(htmlToSections(result.data?.contentHtml || ''));
        setBookmarked(Boolean(result.data?.bookmarked));
      })
      .catch((error) => {
        if (active) setMessage(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [examSubjectId, questionNumber]);

  const saveNote = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(
        `/api/exams/${examSubjectId}/questions/${questionNumber}/note`,
        {
          method: 'PUT',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contentHtml: sectionsToHtml(sections),
            bookmarked,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || '오답노트를 저장하지 못했습니다.');
      }

      onSaved?.(result.data);
      setMessage('오답노트를 저장했습니다.');
    } catch (error) {
      setMessage(error.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="question-note-editor-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(30, 25, 35, 0.45)',
        display: 'grid',
        placeItems: 'center',
        padding: 20,
      }}
    >
      <section
        style={{
          width: 'min(100%, 720px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
          borderRadius: 18,
          background: '#fff',
          boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div>
            <small style={{ color: '#a17c9b', fontWeight: 700 }}>
              MY STUDY NOTE
            </small>
            <h2 style={{ margin: '7px 0' }}>
              {subjectLabel} · {questionNumber}번
            </h2>
            <p style={{ margin: 0, color: '#888', fontSize: 13 }}>
              나만의 오답노트를 작성해 보세요.
            </p>
          </div>

          <button
            type="button"
            className="question-note-editor-close"
            onClick={onClose}
          >
            닫기
          </button>
        </div>

        {loading ? (
          <p>기존 오답노트를 불러오는 중입니다.</p>
        ) : (
          <>
            {NOTE_SECTIONS.map(({ key, label, placeholder }) => (
              <div key={key} style={{ marginBottom: 20 }}>
                <label
                  htmlFor={`note-${key}`}
                  style={{
                    display: 'block',
                    fontWeight: 700,
                    marginBottom: 8,
                    color: '#39313b',
                  }}
                >
                  {label}
                </label>

                <textarea
                  id={`note-${key}`}
                  value={sections[key]}
                  onChange={(event) => setSections((previous) => ({
                    ...previous,
                    [key]: event.target.value,
                  }))}
                  placeholder={placeholder}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: 14,
                    boxSizing: 'border-box',
                    border: '1px solid #e5dce8',
                    borderRadius: 12,
                    resize: 'vertical',
                    fontSize: 14,
                    lineHeight: 1.7,
                    outlineColor: '#b58eaf',
                  }}
                />
              </div>
            ))}

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 10,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={bookmarked}
                onChange={(event) => setBookmarked(event.target.checked)}
              />
              다시 풀 문제로 표시
            </label>
          </>
        )}

        {message && (
          <p role="status" style={{ color: '#9a6485', fontSize: 13 }}>
            {message}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 22,
          }}
        >
          <button
            type="button"
            className="question-note-editor-cancel"
            onClick={onClose}
          >
            취소
          </button>

          <button
            type="button"
            className="question-note-editor-save"
            onClick={saveNote}
            disabled={loading || saving}
          >
            {saving ? '저장 중...' : '오답노트 저장'}
          </button>
        </div>
      </section>
    </div>
  );
}
