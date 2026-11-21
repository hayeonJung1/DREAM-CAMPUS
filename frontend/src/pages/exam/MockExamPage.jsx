import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  ListChecks,
} from 'lucide-react';
import './MockExamPage.css';

export default function MockExamPage() {
  const [year, setYear] = useState('2027학년도');
  const [month, setMonth] = useState('9월');
  const [koreanOption, setKoreanOption] = useState('');
  const [mathOption, setMathOption] = useState('');
  const [selectedInquiries, setSelectedInquiries] = useState([]);

  const [apiSubjects, setApiSubjects] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [view, setView] = useState('selection');
  const [activeSubjectKey, setActiveSubjectKey] = useState(null);
  const [draftChoiceAnswers, setDraftChoiceAnswers] = useState('');
  const [draftMathAnswers, setDraftMathAnswers] = useState(Array(30).fill(''));
  const [savedAnswers, setSavedAnswers] = useState({});
  const [gradeResult, setGradeResult] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const years = ['2027학년도', '2026학년도', '2025학년도', '2024학년도'];
  const months = ['3월', '5월', '6월', '7월', '9월', '10월', '11월'];
  const examMonth = Number.parseInt(month, 10);

  useEffect(() => {
    let isActive = true;

    setApiLoading(true);
    setApiError('');
    setApiSubjects([]);

    fetch(`/api/exams?academicYear=${encodeURIComponent(year)}&examMonth=${examMonth}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`과목 조회에 실패했습니다. (${response.status})`);
        }
        return response.json();
      })
      .then((result) => {
        if (!isActive) return;
        if (!result.success) {
          throw new Error(result.message || '과목 조회에 실패했습니다.');
        }
        setApiSubjects(Array.isArray(result.data) ? result.data : []);
      })
      .catch((error) => {
        if (isActive) setApiError(error.message || '과목 조회 중 오류가 발생했습니다.');
      })
      .finally(() => {
        if (isActive) setApiLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [year, examMonth]);

  const yearsInData = apiSubjects;
  const koreanOptions = yearsInData
    .filter((subject) => subject.subjectCode.startsWith('KOR_'))
    .map((subject) => subject.optionName)
    .filter(Boolean);
  const mathOptions = yearsInData
    .filter((subject) => subject.subjectCode.startsWith('MATH_'))
    .map((subject) => subject.optionName)
    .filter(Boolean);
  const socialStudies = yearsInData
    .filter((subject) => subject.subjectCode.startsWith('SOC_'))
    .map((subject) => subject.subjectName);
  const scienceStudies = yearsInData
    .filter((subject) => subject.subjectCode.startsWith('SCI_'))
    .map((subject) => subject.subjectName);

  const koreanApiSubject = yearsInData.find(
    (subject) => subject.subjectCode.startsWith('KOR_') && subject.optionName === koreanOption,
  );
  const mathApiSubject = yearsInData.find(
    (subject) => subject.subjectCode.startsWith('MATH_') && subject.optionName === mathOption,
  );
  const englishApiSubject = yearsInData.find((subject) => subject.subjectCode === 'ENGLISH');
  const historyApiSubject = yearsInData.find((subject) => subject.subjectCode === 'HISTORY');

  const activeSubjects = [
    koreanApiSubject && {
      key: 'korean',
      apiSubject: koreanApiSubject,
      name: koreanApiSubject.subjectName,
      detail: koreanApiSubject.optionName,
      questionCount: koreanApiSubject.questionCount,
      type: 'choice',
    },
    mathApiSubject && {
      key: 'math',
      apiSubject: mathApiSubject,
      name: mathApiSubject.subjectName,
      detail: mathApiSubject.optionName,
      questionCount: mathApiSubject.questionCount,
      type: 'math',
    },
    englishApiSubject && {
      key: 'english',
      apiSubject: englishApiSubject,
      name: englishApiSubject.subjectName,
      detail: '듣기 문항 포함',
      questionCount: englishApiSubject.questionCount,
      type: 'choice',
    },
    historyApiSubject && {
      key: 'history',
      apiSubject: historyApiSubject,
      name: historyApiSubject.subjectName,
      detail: '필수 응시',
      questionCount: historyApiSubject.questionCount,
      type: 'choice',
    },
    ...selectedInquiries.map((name, index) => {
      const apiSubject = yearsInData.find((subject) => subject.subjectName === name);
      if (!apiSubject) return null;
      return {
        key: `inquiry-${name}`,
        apiSubject,
        name: apiSubject.subjectName,
        detail: apiSubject.optionName || '탐구 영역',
        questionCount: apiSubject.questionCount,
        type: 'choice',
        order: index + 1,
      };
    }),
  ].filter(Boolean);

  const currentSubject = activeSubjects.find((item) => item.key === activeSubjectKey);
  const answeredCount = currentSubject?.type === 'math'
    ? draftMathAnswers.filter((answer) => answer !== '').length
    : draftChoiceAnswers.split('').filter((answer) => answer !== '0').length;
  const savedCount = activeSubjects.filter((item) => Object.prototype.hasOwnProperty.call(savedAnswers, item.key)).length;
  const selectedExamText = `${year} · 고3 · ${month}`;

  const clearSavedAnswers = () => {
    setSavedAnswers({});
    setGradeResult(null);
    setMessage('');
  };

  const handleYearChange = (value) => {
    setYear(value);
    setKoreanOption('');
    setMathOption('');
    setSelectedInquiries([]);
    clearSavedAnswers();
    setView('selection');
  };

  const handleMonthChange = (value) => {
    setMonth(value);
    setKoreanOption('');
    setMathOption('');
    setSelectedInquiries([]);
    clearSavedAnswers();
    setView('selection');
  };

  const handleInquiryToggle = (name) => {
    const selectedSubject = yearsInData.find((subject) => subject.subjectName === name);
    if (selectedSubject?.dataStatus === 'NOT_READY') {
      setMessage('이 과목은 아직 정답 데이터가 등록되지 않았습니다.');
      return;
    }

    setSelectedInquiries((previous) => {
      if (previous.includes(name)) {
        return previous.filter((item) => item !== name);
      }
      if (previous.length >= 2) {
        setMessage('탐구 과목은 최대 2개까지 선택할 수 있습니다.');
        return previous;
      }
      setMessage('');
      return [...previous, name];
    });
    setSavedAnswers({});
    setGradeResult(null);
  };

  const handleChoiceAnswerChange = (event) => {
    const cleaned = event.target.value.replace(/[^0-5]/g, '').slice(0, currentSubject.questionCount);
    setDraftChoiceAnswers(cleaned);
    setMessage('');
  };

  const handleMathAnswerChange = (index, value) => {
    const cleaned = index < 21
      ? value.replace(/[^1-5]/g, '').slice(0, 1)
      : value.replace(/\D/g, '').slice(0, 4);
    setDraftMathAnswers((previous) => previous.map((answer, i) => (i === index ? cleaned : answer)));
    setMessage('');
  };

  const openAnswerSheet = (subjectKey) => {
    const target = activeSubjects.find((item) => item.key === subjectKey);
    if (!target) return;

    const existing = savedAnswers[subjectKey];
    setActiveSubjectKey(subjectKey);
    if (target.type === 'math') {
      setDraftMathAnswers(Array.isArray(existing) ? [...existing] : Array(30).fill(''));
      setDraftChoiceAnswers('');
    } else {
      setDraftChoiceAnswers(typeof existing === 'string' ? existing : '');
      setDraftMathAnswers(Array(30).fill(''));
    }
    setMessage('');
    setView('entry');
  };

  const confirmExamSelection = () => {
    if (apiLoading) {
      setMessage('과목 정보를 불러오고 있습니다. 잠시 후 다시 선택해 주세요.');
      return;
    }
    if (apiError || apiSubjects.length === 0) {
      setMessage('선택한 시험의 과목 데이터가 없습니다. 학년도와 시험 월을 확인해 주세요.');
      return;
    }
    if (!koreanOption || !koreanApiSubject || !mathOption || !mathApiSubject) {
      setMessage('국어와 수학 선택과목을 각각 하나씩 선택해 주세요.');
      return;
    }
    if (selectedInquiries.length < 1 || selectedInquiries.length > 2) {
      setMessage('사회·과학탐구 과목을 1~2개 선택해 주세요.');
      return;
    }
    clearSavedAnswers();
    setView('subjects');
  };

  const saveCurrentAnswers = async () => {
    if (!currentSubject) return;
    if (currentSubject.apiSubject.dataStatus === 'NOT_READY') {
      setMessage('아직 정답 데이터가 등록되지 않은 과목입니다.');
      return;
    }

    const values = currentSubject.type === 'math'
      ? draftMathAnswers
      : draftChoiceAnswers.split('').map((answer) => (answer === '0' ? '' : answer));

    const answers = Object.fromEntries(
      values
        .map((answer, index) => [index + 1, answer.trim()])
        .filter(([, answer]) => answer !== ''),
    );

    if (Object.keys(answers).length === 0) {
      setMessage('채점할 답안을 한 문항 이상 입력해 주세요. 미응답 문항은 비워 두셔도 됩니다.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/exams/${currentSubject.apiSubject.examSubjectId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || '채점에 실패했습니다.');
      }

      const grade = result.data;
      if (!Array.isArray(grade.questionResults) || grade.questionResults.length === 0) {
        throw new Error('문항별 채점 결과를 받지 못했습니다. 백엔드 응답 형식을 확인해 주세요.');
      }

      const details = grade.questionResults.map((item) => ({
        number: item.questionNumber,
        submitted: item.submittedAnswer ?? '',
        correct: String(item.correctAnswer),
        isCorrect: item.isCorrect,
        points: item.points,
      }));

      const wrongQuestions = details
        .filter((item) => item.submitted !== '' && !item.isCorrect)
        .map((item) => item.number);
      const unansweredQuestions = details
        .filter((item) => item.submitted === '')
        .map((item) => item.number);

      setSavedAnswers((previous) => ({
        ...previous,
        [currentSubject.key]: currentSubject.type === 'math'
          ? [...draftMathAnswers]
          : draftChoiceAnswers,
      }));

      setGradeResult({
        subjectKey: currentSubject.key,
        examTitle: `${year} ${month} 모의고사`,
        subjectName: grade.subjectName,
        optionName: grade.optionName,
        totalCount: details.length,
        correctCount: grade.correctCount,
        wrongCount: grade.wrongCount,
        unansweredCount: grade.unansweredCount,
        accuracy: details.length ? Math.round((grade.correctCount / details.length) * 100) : 0,
        score: grade.score,
        maxScore: grade.maxScore,
        wrongQuestions,
        unansweredQuestions,
        details,
        submittedAnswers: currentSubject.type === 'math' ? [...draftMathAnswers] : draftChoiceAnswers,
      });

      setView('result');
    } catch (error) {
      setMessage(error.message || '채점 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeExamSelection = () => {
    setView('selection');
    setActiveSubjectKey(null);
    setMessage('');
  };

  const resetCurrentAnswers = () => {
    if (currentSubject?.type === 'math') {
      setDraftMathAnswers(Array(30).fill(''));
    } else {
      setDraftChoiceAnswers('');
    }
    setMessage('');
  };

  if (view === 'result' && gradeResult) {
    return (
      <div className="page-content subpage-content mock-page omr-page">
        <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> MOCK EXAM <ChevronRight size={14} /> 채점 결과</div>
        <section className="mock-selection-panel omr-result-panel">
          <div className="omr-result-icon"><CheckCircle2 size={32} /></div>
          <span className="eyebrow">AUTO GRADING COMPLETE</span>
          <h1>{gradeResult.subjectName} 채점 결과</h1>
          <p>{gradeResult.examTitle} · {gradeResult.optionName || '필수 영역'}</p>
          <div className="omr-grade-metrics">
            <div className="omr-grade-metric primary">
              <span>총점</span>
              <strong>{gradeResult.score}<small> / {gradeResult.maxScore}점</small></strong>
            </div>
            <div className="omr-grade-metric">
              <span>정답</span>
              <strong>{gradeResult.correctCount}<small>문항</small></strong>
            </div>
            <div className="omr-grade-metric">
              <span>오답</span>
              <strong>{gradeResult.wrongCount}<small>문항</small></strong>
            </div>
            <div className="omr-grade-metric">
              <span>미응답</span>
              <strong>{gradeResult.unansweredCount}<small>문항</small></strong>
            </div>
            <div className="omr-grade-metric">
              <span>정답률</span>
              <strong>{gradeResult.accuracy}<small>%</small></strong>
            </div>
          </div>

          <div className="omr-result-section-title">문항별 채점 결과</div>
          <div className="omr-answer-grid omr-graded-answer-grid">
            {gradeResult.details.map((item) => {
              const isUnanswered = item.submitted === '';
              const statusClass = isUnanswered ? 'is-unanswered' : item.isCorrect ? 'is-correct' : 'is-wrong';
              return (
                <div className={`omr-answer-cell ${statusClass}`} key={item.number}>
                  <small>{item.number}번</small>
                  <strong>{isUnanswered ? '—' : item.isCorrect ? 'O' : 'X'}</strong>
                  <em>내 답: {isUnanswered ? '미응답' : item.submitted} · 정답: {item.correct}</em>
                </div>
              );
            })}
          </div>

          {gradeResult.wrongQuestions.length > 0 && (
            <div className="omr-key-notice">
              <strong>오답 문항: {gradeResult.wrongQuestions.join(', ')}번</strong>
              <p>붉은색 X 표시가 있는 문항을 확인해 주세요.</p>
            </div>
          )}
          {gradeResult.unansweredQuestions.length > 0 && (
            <div className="omr-key-notice omr-score-caveat">
              <strong>미응답 문항: {gradeResult.unansweredQuestions.join(', ')}번</strong>
              <p>미응답 문항은 오답과 구분하여 표시했습니다.</p>
            </div>
          )}

          <div className="omr-result-actions">
            <button type="button" className="mock-secondary-button" onClick={() => openAnswerSheet(gradeResult.subjectKey)}>답안 수정하기</button>
            <button type="button" className="mock-confirm-button" onClick={() => setView('subjects')}>과목 목록으로 <ArrowRight size={16} /></button>
          </div>
        </section>
      </div>
    );
  }

  if (view === 'entry' && currentSubject) {
    return (
      <div className="page-content subpage-content mock-page omr-page">
        <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> MOCK EXAM <ChevronRight size={14} /> {currentSubject.name} 답안 입력</div>
      <section className="mock-heading mock-heading-sage">
          <div>
            <span className="eyebrow">MOCK EXAM · ANSWER SHEET</span>
            <h1>{currentSubject.name} OMR 답안 입력</h1>
            <p>{selectedExamText} · {currentSubject.detail}</p>
          </div>
          <div className="mock-heading-icon"><FileText size={34} /></div>
        </section>

        <section className="mock-selection-panel omr-entry-panel">
          <div className="mock-section-title">
            <div className="mock-title-icon"><BookOpenCheck size={19} /></div>
            <div>
              <span className="eyebrow">ANSWER SHEET</span>
              <h2>답안을 입력해 주세요.</h2>
              {currentSubject.type === 'math'
                ? <p>1~21번은 객관식, 22~30번은 단답형입니다. 미응답 문항은 비워 두셔도 됩니다.</p>
                : <p>1번부터 {currentSubject.questionCount}번까지 답안을 순서대로 입력해 주세요. 미응답 문항은 숫자 0으로 표시해 주세요.</p>}
            </div>
          </div>

          {currentSubject.type === 'math' ? (
            <>
              <div className="omr-input-meta">
                <span>객관식 1~21번 · 단답형 22~30번</span>
                <strong>{answeredCount} / {currentSubject.questionCount}문항</strong>
              </div>
              <div className="omr-progress-track"><span style={{ width: `${(answeredCount / currentSubject.questionCount) * 100}%` }} /></div>
              <div className="omr-math-answer-grid">
                {draftMathAnswers.map((answer, index) => (
                  <label className={`omr-math-answer-cell ${answer !== '' ? 'filled' : ''}`} key={index}>
                    <span>{index + 1}번 · {index < 21 ? '객관식' : '단답형'}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={index < 21 ? 1 : 4}
                      value={answer}
                      onChange={(event) => handleMathAnswerChange(index, event.target.value)}
                      placeholder={index < 21 ? '1~5' : '숫자'}
                      aria-label={`${index + 1}번 답안`}
                    />
                  </label>
                ))}
              </div>
            </>
          ) : (
            <>
              <label className="omr-input-label" htmlFor="omr-answer-input">제출 답안</label>
              <input
                id="omr-answer-input"
                className="omr-answer-input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                spellCheck="false"
                maxLength={currentSubject.questionCount}
                value={draftChoiceAnswers}
                onChange={handleChoiceAnswerChange}
                placeholder={`예: ${'12345'.repeat(Math.ceil(currentSubject.questionCount / 5)).slice(0, Math.min(15, currentSubject.questionCount))}...`}
              />
              <div className="omr-input-meta">
                <span>숫자 1~5 입력 · 미응답은 0 입력</span>
                <strong>{answeredCount} / {currentSubject.questionCount}문항</strong>
              </div>
              <div className="omr-progress-track"><span style={{ width: `${(answeredCount / currentSubject.questionCount) * 100}%` }} /></div>
              <div className="omr-number-preview-title">
                <strong>입력 확인</strong>
                <span>입력한 답안이 문항 순서대로 표시됩니다.</span>
              </div>
              <div className="omr-answer-grid">
                {Array.from({ length: currentSubject.questionCount }, (_, index) => {
                  const answer = draftChoiceAnswers[index];
                  return (
                    <div className={`omr-answer-cell ${answer && answer !== '0' ? 'filled' : ''}`} key={index}>
                      <small>{index + 1}</small>
                      <strong>{answer === '0' ? '—' : answer || '·'}</strong>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {message && <div className="omr-warning-message" role="alert">{message}</div>}
          <div className="omr-actions">
            <button type="button" className="mock-secondary-button" onClick={resetCurrentAnswers} disabled={isSubmitting}>답안 지우기</button>
            <button type="button" className="mock-confirm-button" onClick={saveCurrentAnswers} disabled={isSubmitting}>
              {isSubmitting ? '채점 중...' : '제출하고 채점하기'} <ArrowRight size={16} />
            </button>
          </div>
          <button type="button" className="omr-back-link" onClick={() => { setMessage(''); setView('subjects'); }} disabled={isSubmitting}>← 과목 목록으로 돌아가기</button>
        </section>
      </div>
    );
  }

  if (view === 'subjects') {
    return (
      <div className="page-content subpage-content mock-page omr-page">
        <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> MOCK EXAM <ChevronRight size={14} /> 답안 입력 과목</div>
        <section className="mock-heading mock-heading-powder">
          <div>
            <span className="eyebrow">MOCK EXAM · GRADE 3</span>
            <h1>응시 과목 및 답안 입력</h1>
            <p>{selectedExamText} · 선택한 과목의 답안지를 각각 작성해 주세요.</p>
          </div>
          <div className="mock-heading-icon"><FileText size={34} /></div>
        </section>

        <section className="mock-selection-panel">
          <div className="mock-section-title">
            <div className="mock-title-icon"><ListChecks size={19} /></div>
            <div>
              <span className="eyebrow">YOUR SUBJECTS</span>
              <h2>선택한 과목</h2>
              <p>국어·수학 선택과목과 탐구 선택을 확인해 주세요.</p>
            </div>
          </div>
          <div className="mock-selected-summary-grid">
            <div><span>국어 선택</span><strong>{koreanOption}</strong></div>
            <div><span>수학 선택</span><strong>{mathOption}</strong></div>
            <div className="inquiry-summary"><span>탐구 선택 ({selectedInquiries.length}개)</span><strong>{selectedInquiries.join(' · ')}</strong></div>
          </div>
        </section>

        <section className="mock-selection-panel">
          <div className="mock-subheading">
            <strong>답안 입력 목록</strong>
            <span>{savedCount} / {activeSubjects.length}과목 채점 완료</span>
          </div>
          <div className="mock-progress-track"><span style={{ width: `${activeSubjects.length ? (savedCount / activeSubjects.length) * 100 : 0}%` }} /></div>
          <div className="mock-answer-subject-list">
            {activeSubjects.map((item) => {
              const isSaved = Object.prototype.hasOwnProperty.call(savedAnswers, item.key);
              return (
                <div className={`mock-answer-subject-card ${isSaved ? 'saved' : ''}`} key={item.key}>
                  <div className="mock-answer-subject-info">
                    <span className="mock-answer-subject-category">{item.key === 'korean' || item.key === 'math' ? '선택과목 포함' : item.key === 'english' || item.key === 'history' ? '필수 영역' : `탐구 ${item.order}선택`}</span>
                    <strong>{item.name}</strong>
                    <small>{item.detail} · {item.questionCount}문항</small>
                  </div>
                  <div className="mock-answer-subject-action">
                    {isSaved && <span className="mock-saved-label"><CheckCircle2 size={14} /> 채점 완료</span>}
                    <button type="button" className="mock-secondary-button" onClick={() => openAnswerSheet(item.key)}>{isSaved ? '답안 수정' : '답안 입력'}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mock-confirm-panel">
          <div className="mock-confirm-copy">
            <span className="eyebrow">EXAM SETTINGS</span>
            <h2>시험 조건을 변경하시겠습니까?</h2>
            <p>학년도, 시험 월 또는 선택과목을 다시 설정할 수 있습니다.</p>
          </div>
          <button type="button" className="mock-confirm-button" onClick={changeExamSelection}>시험 조건 수정하기 <ArrowRight size={17} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content subpage-content mock-page omr-page">
      <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> MOCK EXAM</div>

      <section className="mock-heading mock-heading-powder">
        <div>
          <span className="eyebrow">MOCK EXAM SERVICE · GRADE 3</span>
          <h1>고3 모의고사 풀서비스</h1>
          <p>학년도와 시행 월, 국어·수학 선택과목, 탐구 과목을 설정해 주세요.</p>
        </div>
        <div className="mock-heading-icon"><FileText size={34} /></div>
      </section>

      <section className="mock-selection-panel">
        <div className="mock-section-title">
          <div className="mock-title-icon"><CalendarDays size={19} /></div>
          <div>
            <span className="eyebrow">STEP 01</span>
            <h2>시험 정보 선택</h2>
            <p>이 서비스는 고3 수험생 전용입니다.</p>
          </div>
        </div>
        <div className="mock-grade-fixed"><GraduationCap size={18} /><span>응시 학년</span><strong>고3</strong><small>고3 전용 서비스</small></div>
        <div className="mock-select-grid">
          <label className="mock-field">
            <span>학년도</span>
            <select value={year} onChange={(event) => handleYearChange(event.target.value)}>
              {years.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="mock-field">
            <span>시험 월</span>
            <select value={month} onChange={(event) => handleMonthChange(event.target.value)}>
              {months.map((item) => <option key={item} value={item}>{item}{item === '11월' ? ' 수능' : ' 모의고사'}</option>)}
            </select>
          </label>
        </div>
        {apiLoading && <div className="omr-data-message">과목 정보를 불러오고 있습니다.</div>}
        {apiError && <div className="omr-warning-message" role="alert">{apiError}</div>}
        {!apiLoading && !apiError && apiSubjects.length === 0 && (
          <div className="omr-data-message">선택한 학년도와 시험 월에 등록된 과목 데이터가 없습니다.</div>
        )}
        <p className="omr-subject-note">공식 정답이 등록된 과목만 자동 채점할 수 있습니다. 정답이 아직 등록되지 않은 과목은 선택할 수 없습니다.</p>
      </section>

      <section className="mock-selection-panel">
        <div className="mock-section-title">
          <div className="mock-title-icon"><BookOpenCheck size={19} /></div>
          <div>
            <span className="eyebrow">STEP 02</span>
            <h2>국어·수학 선택과목</h2>
            <p>각 영역에서 한 과목씩 선택해 주세요.</p>
          </div>
        </div>
        <div className="mock-elective-block">
          <div className="mock-subheading"><strong>국어</strong><span>공통과목 + 선택과목 1개</span></div>
          <div className="mock-choice-chip-grid two">
            {koreanOptions.map((item) => (
              <button type="button" key={item} aria-pressed={koreanOption === item} className={`mock-choice-chip ${koreanOption === item ? 'selected' : ''}`} onClick={() => { setKoreanOption(item); clearSavedAnswers(); }}>
                {item}{koreanOption === item && <CheckCircle2 size={16} />}
              </button>
            ))}
          </div>
        </div>
        <div className="mock-elective-block">
          <div className="mock-subheading"><strong>수학</strong><span>공통과목 + 선택과목 1개</span></div>
          <div className="mock-choice-chip-grid three">
            {mathOptions.map((item) => (
              <button type="button" key={item} aria-pressed={mathOption === item} className={`mock-choice-chip ${mathOption === item ? 'selected' : ''}`} onClick={() => { setMathOption(item); clearSavedAnswers(); }}>
                {item}{mathOption === item && <CheckCircle2 size={16} />}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mock-selection-panel">
        <div className="mock-section-title">
          <div className="mock-title-icon"><ListChecks size={19} /></div>
          <div>
            <span className="eyebrow">STEP 03</span>
            <h2>사회·과학탐구 선택</h2>
            <p>사회·과학탐구 과목 중 최대 2개까지 선택해 주세요.</p>
          </div>
        </div>
        <div className="mock-inquiry-counter"><strong>{selectedInquiries.length} / 2</strong><span>과목 선택</span><div className="mock-inquiry-counter-track"><i style={{ width: `${(selectedInquiries.length / 2) * 100}%` }} /></div></div>
        <div className="mock-inquiry-group">
          <div className="mock-inquiry-group-title"><strong>사회탐구</strong><span>{socialStudies.length}과목</span></div>
          <div className="mock-inquiry-grid">
            {socialStudies.map((item) => (
              <button type="button" key={item} aria-pressed={selectedInquiries.includes(item)} disabled={selectedInquiries.length >= 2 && !selectedInquiries.includes(item)} className={`mock-inquiry-chip ${selectedInquiries.includes(item) ? 'selected' : ''}`} onClick={() => handleInquiryToggle(item)}>
                {item}{selectedInquiries.includes(item) && <CheckCircle2 size={15} />}
              </button>
            ))}
          </div>
        </div>
        <div className="mock-inquiry-group">
          <div className="mock-inquiry-group-title"><strong>과학탐구</strong><span>{scienceStudies.length}과목</span></div>
          <div className="mock-inquiry-grid">
            {scienceStudies.map((item) => {
              const subject = yearsInData.find((entry) => entry.subjectName === item);
              const notReady = subject?.dataStatus === 'NOT_READY';
              return (
                <button type="button" key={item} aria-pressed={selectedInquiries.includes(item)} disabled={notReady || (selectedInquiries.length >= 2 && !selectedInquiries.includes(item))} className={`mock-inquiry-chip ${selectedInquiries.includes(item) ? 'selected' : ''}`} onClick={() => handleInquiryToggle(item)} title={notReady ? '정답 데이터 미등록' : ''}>
                  {item}{notReady ? ' · 준비 중' : selectedInquiries.includes(item) && <CheckCircle2 size={15} />}
                </button>
              );
            })}
          </div>
        </div>
        <p className="omr-subject-note">사회탐구와 과학탐구를 함께 선택할 수 있습니다. 정답 미등록 과목은 선택할 수 없습니다.</p>
      </section>

      {message && <div className="omr-warning-message" role="alert">{message}</div>}
      <section className="mock-confirm-panel">
        <div className="mock-confirm-copy">
          <span className="eyebrow">MY SELECTED EXAM</span>
          <h2>선택한 시험 확인</h2>
          <p>{selectedExamText} · 국어 {koreanOption || '미선택'} · 수학 {mathOption || '미선택'} · 탐구 {selectedInquiries.length ? selectedInquiries.join(' / ') : '미선택'}</p>
        </div>
        <button type="button" className="mock-confirm-button" onClick={confirmExamSelection} disabled={apiLoading || apiSubjects.length === 0}>선택 완료 <ArrowRight size={17} /></button>
      </section>
    </div>
  );
}
