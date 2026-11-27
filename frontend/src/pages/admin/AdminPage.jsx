import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, ArrowUpRight, BookOpen, Check, ChevronDown,
  FileText, LoaderCircle, RefreshCw, Search, ShieldCheck, Users, X,
} from 'lucide-react';
import api from '../../api/axios.js';
import './AdminPage.css';

const emptySummary = { members: 0, admins: 0, active: 0, subjects: 0 };

function getApiData(response) {
  const payload = response?.data;
  if (payload && payload.success === false) {
    throw new Error(payload.message || '요청을 처리하지 못했습니다.');
  }
  return payload?.data ?? payload;
}

function getErrorMessage(error, fallback) {
  return error?.message || error?.response?.data?.message || fallback;
}

export default function AdminPage() {
  const [tab, setTab] = useState('members');
  const [forbidden, setForbidden] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [members, setMembers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadMembers = async (keyword = '') => {
    const response = await api.get('/admin/members', { params: keyword.trim() ? { keyword: keyword.trim() } : {} });
    const result = getApiData(response);
    const rows = Array.isArray(result) ? result : [];
    setMembers(rows);
    return rows;
  };

  const loadSubjects = async () => {
    const response = await api.get('/admin/exam/subjects');
    const result = getApiData(response);
    const rows = Array.isArray(result) ? result : [];
    setSubjects(rows);
    setSummary((previous) => ({ ...previous, subjects: rows.length }));
    return rows;
  };

  const loadAll = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const [memberRows, subjectRows] = await Promise.all([loadMembers(), loadSubjects()]);
      setSummary({
        members: memberRows.length,
        admins: memberRows.filter((member) => member.role === 'ADMIN').length,
        active: memberRows.filter((member) => member.status === 'ACTIVE').length,
        subjects: subjectRows.length,
      });
      setForbidden(false);
    } catch (requestError) {
      if ([401, 403].includes(requestError?.status) || [401, 403].includes(requestError?.response?.status)) {
        setForbidden(true);
      } else {
        setError(getErrorMessage(requestError, '관리자 정보를 불러오지 못했습니다.'));
      }
    } finally {
      setLoading(false);
      setCheckingAccess(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (checkingAccess) {
    return <div className="page-content admin-page"><div className="admin-state-card"><LoaderCircle className="admin-spin" size={22} /> 관리자 권한을 확인하고 있습니다.</div></div>;
  }

  if (forbidden) {
    return (
      <div className="page-content admin-page">
        <div className="admin-denied-card">
          <div className="admin-denied-icon"><ShieldCheck size={28} /></div>
          <h1>관리자 전용 페이지입니다.</h1>
          <p>관리자 계정으로 로그인한 후 이용해 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content admin-page">
      <section className="admin-hero">
        <div className="admin-hero-copy">
          <span className="admin-eyebrow">DREAM CAMPUS · ADMIN</span>
          <h1>관리자 페이지</h1>
          <p>회원과 모의고사 데이터를 한곳에서 관리할 수 있습니다.</p>
        </div>
        <div className="admin-hero-mark"><ShieldCheck size={34} /></div>
      </section>

      <section className="admin-summary-grid" aria-label="관리 현황">
        <SummaryCard icon={Users} label="전체 회원" value={summary.members} detail="등록된 회원" />
        <SummaryCard icon={ShieldCheck} label="관리자" value={summary.admins} detail="관리자 권한 계정" />
        <SummaryCard icon={Check} label="활성 회원" value={summary.active} detail="이용 가능한 계정" />
        <SummaryCard icon={BookOpen} label="시험 과목" value={summary.subjects} detail="등록된 과목 데이터" />
      </section>

      <section className="admin-workspace">
        <div className="admin-workspace-heading">
          <div>
            <span className="admin-eyebrow">MANAGEMENT</span>
            <h2>관리 메뉴</h2>
          </div>
          <button className="admin-refresh-button" type="button" onClick={loadAll} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'admin-spin' : ''} /> 새로고침
          </button>
        </div>

        <div className="admin-tabs" role="tablist" aria-label="관리 메뉴 선택">
          <button type="button" role="tab" aria-selected={tab === 'members'} className={tab === 'members' ? 'is-active' : ''} onClick={() => { setTab('members'); setMessage(''); setError(''); }}>
            <Users size={17} /> 회원 관리
          </button>
          <button type="button" role="tab" aria-selected={tab === 'exam'} className={tab === 'exam' ? 'is-active' : ''} onClick={() => { setTab('exam'); setMessage(''); setError(''); }}>
            <FileText size={17} /> 모의고사 관리
          </button>
        </div>

        {message && <div className="admin-feedback admin-feedback-success" role="status"><Check size={16} /> {message}</div>}
        {error && <div className="admin-feedback admin-feedback-error" role="alert"><AlertCircle size={16} /> {error}</div>}

        {tab === 'members' ? (
          <MemberManagement members={members} setMembers={setMembers} onMessage={setMessage} onError={setError} onRefresh={loadMembers} loading={loading} />
        ) : (
          <ExamManagement subjects={subjects} setSubjects={setSubjects} onMessage={setMessage} onError={setError} onRefresh={loadSubjects} />
        )}
      </section>
      <footer className="admin-footer">DREAM CAMPUS <span>ADMIN MANAGEMENT</span></footer>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="admin-summary-card">
      <div className="admin-summary-icon"><Icon size={19} /></div>
      <div className="admin-summary-copy">
        <span>{label}</span>
        <strong>{value.toLocaleString('ko-KR')}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function MemberManagement({ members, setMembers, onMessage, onError, onRefresh, loading }) {
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState(null);
  const [searching, setSearching] = useState(false);

  const search = async (event) => {
    event?.preventDefault();
    setSearching(true);
    onError('');
    onMessage('');
    try {
      await onRefresh(keyword);
    } catch (requestError) {
      onError(getErrorMessage(requestError, '회원 목록을 불러오지 못했습니다.'));
    } finally {
      setSearching(false);
    }
  };

  const changeMember = async (member, kind, value) => {
    onError('');
    onMessage('');
    try {
      const response = await api.patch(`/admin/members/${member.id}/${kind}`, { [kind]: value });
      const updated = getApiData(response);
      setMembers((previous) => previous.map((item) => item.id === member.id ? updated : item));
      setSelected((previous) => previous?.id === member.id ? updated : previous);
      onMessage(kind === 'role' ? '회원 권한이 변경되었습니다.' : '회원 상태가 변경되었습니다.');
    } catch (requestError) {
      onError(getErrorMessage(requestError, '회원 정보를 변경하지 못했습니다.'));
      await onRefresh(keyword).catch(() => {});
    }
  };

  return (
    <div className="admin-panel-content">
      <div className="admin-panel-title-row">
        <div><h3>회원 목록</h3><p>회원 권한과 이용 상태를 관리할 수 있습니다.</p></div>
        <span className="admin-count-pill">총 {members.length.toLocaleString('ko-KR')}명</span>
      </div>
      <form className="admin-search-form" onSubmit={search}>
        <div className="admin-search-input-wrap"><Search size={17} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="이름 또는 이메일을 입력해 주세요." aria-label="회원 검색" /></div>
        <button type="submit" disabled={searching}><Search size={15} /> 검색</button>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>회원 ID</th><th>이메일</th><th>이름</th><th>권한</th><th>상태</th><th>상세</th></tr></thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td className="admin-id-cell">#{member.id}</td>
                <td>{member.email}</td>
                <td className="admin-member-name">{member.name}</td>
                <td><select className="admin-inline-select" value={member.role} onChange={(event) => changeMember(member, 'role', event.target.value)} aria-label={`${member.name} 권한 변경`}><option value="USER">일반 회원</option><option value="ADMIN">관리자</option></select></td>
                <td><select className={`admin-inline-select ${member.status === 'SUSPENDED' ? 'is-suspended' : 'is-active'}`} value={member.status} onChange={(event) => changeMember(member, 'status', event.target.value)} aria-label={`${member.name} 상태 변경`}><option value="ACTIVE">활성</option><option value="SUSPENDED">정지</option></select></td>
                <td><button type="button" className="admin-detail-button" onClick={() => setSelected(member)}>상세 보기 <ArrowUpRight size={14} /></button></td>
              </tr>
            ))}
            {!members.length && <tr><td colSpan="6" className="admin-empty-cell">{loading || searching ? '회원 정보를 불러오고 있습니다.' : '검색 결과가 없습니다.'}</td></tr>}
          </tbody>
        </table>
      </div>
      {selected && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <section className="admin-detail-modal" role="dialog" aria-modal="true" aria-labelledby="admin-member-detail-title">
          <button type="button" className="admin-modal-close" onClick={() => setSelected(null)} aria-label="상세 정보 닫기"><X size={19} /></button>
          <span className="admin-eyebrow">MEMBER INFORMATION</span>
          <h3 id="admin-member-detail-title">회원 상세 정보</h3>
          <dl><div><dt>회원 ID</dt><dd>#{selected.id}</dd></div><div><dt>이름</dt><dd>{selected.name}</dd></div><div><dt>이메일</dt><dd>{selected.email}</dd></div><div><dt>권한</dt><dd>{selected.role === 'ADMIN' ? '관리자' : '일반 회원'}</dd></div><div><dt>상태</dt><dd>{selected.status === 'ACTIVE' ? '활성' : '정지'}</dd></div>{selected.createdAt && <div><dt>가입일</dt><dd>{String(selected.createdAt).replace('T', ' ').slice(0, 16)}</dd></div>}</dl>
          <button className="admin-modal-confirm" type="button" onClick={() => setSelected(null)}>확인</button>
        </section>
      </div>}
    </div>
  );
}

function ExamManagement({ subjects, setSubjects, onMessage, onError, onRefresh }) {
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [keyword, setKeyword] = useState('');
  const filteredSubjects = useMemo(() => subjects.filter((subject) => {
    const matchesStatus = filter === 'ALL' || subject.dataStatus === filter;
    const text = `${subject.academicYear} ${subject.examMonth}월 ${subject.subjectCode} ${subject.subjectName} ${subject.optionName || ''}`.toLowerCase();
    return matchesStatus && text.includes(keyword.trim().toLowerCase());
  }), [subjects, filter, keyword]);

  const editSubject = (id, field, value) => setSubjects((previous) => previous.map((subject) => subject.id === id ? { ...subject, [field]: value } : subject));

  const saveSubject = async (subject) => {
    onError(''); onMessage('');
    try {
      const response = await api.put(`/admin/exam/subjects/${subject.id}`, { subjectName: subject.subjectName, dataStatus: subject.dataStatus });
      const updated = getApiData(response);
      setSubjects((previous) => previous.map((item) => item.id === subject.id ? updated : item));
      onMessage('과목 정보가 저장되었습니다.');
    } catch (requestError) {
      onError(getErrorMessage(requestError, '과목 정보를 저장하지 못했습니다.'));
      await onRefresh().catch(() => {});
    }
  };

  const openAnswers = async (subjectId) => {
    if (activeSubjectId === subjectId) { setActiveSubjectId(null); setAnswers([]); return; }
    setActiveSubjectId(subjectId);
    setAnswerLoading(true);
    setAnswers([]);
    onError(''); onMessage('');
    try {
      const response = await api.get(`/admin/exam/subjects/${subjectId}/answers`);
      setAnswers(getApiData(response) || []);
    } catch (requestError) {
      onError(getErrorMessage(requestError, '정답 데이터를 불러오지 못했습니다.'));
      setActiveSubjectId(null);
    } finally {
      setAnswerLoading(false);
    }
  };

  const editAnswer = (id, field, value) => setAnswers((previous) => previous.map((answer) => answer.id === id ? { ...answer, [field]: value } : answer));

  const saveAnswer = async (answer) => {
    onError(''); onMessage('');
    try {
      const response = await api.put(`/admin/exam/answers/${answer.id}`, { correctAnswer: answer.correctAnswer, points: Number(answer.points) });
      const updated = getApiData(response);
      setAnswers((previous) => previous.map((item) => item.id === answer.id ? { ...item, ...updated } : item));
      onMessage(`${answer.questionNumber}번 정답이 저장되었습니다.`);
    } catch (requestError) {
      onError(getErrorMessage(requestError, '정답 데이터를 저장하지 못했습니다.'));
    }
  };

  return (
    <div className="admin-panel-content">
      <div className="admin-panel-title-row">
        <div><h3>모의고사 데이터</h3><p>과목명, 데이터 구분과 문항별 정답 및 배점을 관리할 수 있습니다.</p></div>
        <span className="admin-count-pill">총 {subjects.length.toLocaleString('ko-KR')}개 과목</span>
      </div>
      <div className="admin-exam-toolbar">
        <div className="admin-search-input-wrap"><Search size={17} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="연도, 과목명으로 검색해 주세요." aria-label="과목 검색" /></div>
        <label className="admin-filter-select"><span>데이터 구분</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="ALL">전체</option><option value="OFFICIAL">공식</option><option value="DEMO">DEMO</option><option value="NOT_READY">미등록</option></select><ChevronDown size={14} /></label>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table admin-exam-table">
          <thead><tr><th>시험</th><th>과목 코드</th><th>과목명</th><th>문항 수</th><th>데이터 구분</th><th>관리</th></tr></thead>
          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.academicYear}<small>{subject.examMonth}월</small></td>
                <td className="admin-id-cell">{subject.subjectCode}</td>
                <td><input className="admin-subject-input" value={subject.subjectName || ''} onChange={(event) => editSubject(subject.id, 'subjectName', event.target.value)} aria-label={`${subject.subjectCode} 과목명`} /></td>
                <td>{subject.questionCount}문항</td>
                <td><select className="admin-inline-select" value={subject.dataStatus || 'NOT_READY'} onChange={(event) => editSubject(subject.id, 'dataStatus', event.target.value)} aria-label={`${subject.subjectName} 데이터 구분`}><option value="OFFICIAL">공식</option><option value="DEMO">DEMO</option><option value="NOT_READY">미등록</option></select></td>
                <td><div className="admin-row-actions"><button type="button" className="admin-save-button" onClick={() => saveSubject(subject)}>저장</button><button type="button" className="admin-detail-button" onClick={() => openAnswers(subject.id)}>{activeSubjectId === subject.id ? '정답 닫기' : '정답 보기'}</button></div></td>
              </tr>
            ))}
            {!filteredSubjects.length && <tr><td colSpan="6" className="admin-empty-cell">조건에 맞는 과목이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>
      {activeSubjectId && <section className="admin-answer-panel">
        <div className="admin-panel-title-row"><div><h3>문항별 정답 관리</h3><p>{subjects.find((subject) => subject.id === activeSubjectId)?.subjectName || '선택한 과목'} · 정답과 배점을 수정할 수 있습니다.</p></div><span className="admin-count-pill">{answers.length}문항</span></div>
        {answerLoading ? <div className="admin-state-inline"><LoaderCircle size={18} className="admin-spin" /> 정답 데이터를 불러오고 있습니다.</div> : (
          <div className="admin-table-wrap"><table className="admin-table admin-answer-table"><thead><tr><th>문항</th><th>문항 유형</th><th>정답</th><th>배점</th><th>관리</th></tr></thead><tbody>
            {answers.map((answer) => <tr key={answer.id}><td>{answer.questionNumber}번</td><td>{answer.questionType}</td><td><input className="admin-answer-input" value={answer.correctAnswer ?? ''} onChange={(event) => editAnswer(answer.id, 'correctAnswer', event.target.value)} aria-label={`${answer.questionNumber}번 정답`} /></td><td><input className="admin-points-input" type="number" min="0" max="100" value={answer.points ?? ''} onChange={(event) => editAnswer(answer.id, 'points', event.target.value)} aria-label={`${answer.questionNumber}번 배점`} /></td><td><button type="button" className="admin-save-button" onClick={() => saveAnswer(answer)}>저장</button></td></tr>)}
            {!answers.length && <tr><td colSpan="5" className="admin-empty-cell">등록된 정답 데이터가 없습니다.</td></tr>}
          </tbody></table></div>
        )}
      </section>}
    </div>
  );
}
