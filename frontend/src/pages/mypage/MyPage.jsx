import React, { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, CalendarCheck, ChevronRight,
  Clock3, FileText, LogOut, UserRound, UserRoundPen, X, Camera, CheckCircle2,
} from 'lucide-react';
import { resizeImageFile } from '../../utils/appUtils.js';
import StudentIdCard from '../../components/common/StudentIdCard.jsx';
import './MyPage.css';

const universityOptions = [
  '서울대학교', '연세대학교', '고려대학교', '성균관대학교', '한양대학교',
  '서강대학교', '중앙대학교', '경희대학교', '한국외국어대학교', '서울시립대학교',
  '건국대학교', '동국대학교', '홍익대학교', '국민대학교', '숭실대학교',
  '세종대학교', '단국대학교', '인하대학교', '아주대학교', '가천대학교',
  '경기대학교', '동양미래대학교',
];

export default function MyPage({ profile, onProfileChange, authUser, onNavigate, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile || {});
  const [notice, setNotice] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);

  const displayName = profile?.name?.trim() || authUser?.name || '회원';

  const openEditor = () => {
    setDraft({ ...(profile || {}) });
    setNotice('');
    setIsEditing(true);
  };

  const updateDraft = (field, value) => {
    setDraft((previous) => ({ ...previous, [field]: value }));
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);
    setNotice('사진을 처리하고 있어...');
    try {
      const photo = await resizeImageFile(file);
      updateDraft('photo', photo);
      setNotice('프로필 사진을 등록했어.');
    } catch (error) {
      setNotice(error.message || '사진을 등록하지 못했어. 다른 파일을 선택해 줘.');
    } finally {
      setPhotoLoading(false);
      event.target.value = '';
    }
  };

  const saveProfile = (event) => {
    event.preventDefault();
    onProfileChange(draft);
    setIsEditing(false);
    setNotice('정보를 저장했어!');
  };

  const openPage = (page) => {
    if (typeof onNavigate === 'function') onNavigate(page);
  };

  return (
    <div className="page-content subpage-content dc-mypage dc-mypage-v2">
      <header className="dc-mypage-heading">
        <span>DREAM CAMPUS · MY PAGE</span>
        <h1>나의 마이페이지</h1>
        <p>나의 정보와 학습 기록을 관리해 보세요.</p>
      </header>

      <section className="dc-account-summary" aria-label="회원 정보">
        <div className="dc-account-main">
          <div className="dc-account-avatar">
            {profile?.photo ? <img src={profile.photo} alt="프로필 사진" /> : <UserRound size={43} strokeWidth={1.9} />}
          </div>
          <div className="dc-account-identity">
            <h2>{displayName}님</h2>
            <p>가입 회원 정보</p>
          </div>
          <span className="dc-account-badge">MY ACCOUNT</span>
        </div>
        <div className="dc-account-summary-bottom">
          <strong>회원 정보 관리</strong>
          <button type="button" onClick={openEditor}>
            개인정보 수정 <ArrowRight size={23} />
          </button>
        </div>
      </section>

      <section className="dc-learning-section">
        <h2>1. 나의 학습 현황</h2>
        <div className="dc-learning-grid">
          <button type="button" className="dc-learning-card" onClick={() => openPage('mock')}>
            <FileText className="dc-learning-icon" size={43} strokeWidth={2} />
            <span className="dc-learning-title">모의고사 성적</span>
            <span className="dc-learning-description">나의 채점 기록</span>
            <ArrowUpRight className="dc-learning-arrow" size={23} />
          </button>

          <button type="button" className="dc-learning-card" onClick={() => openPage('notes')}>
            <CalendarCheck className="dc-learning-icon" size={43} strokeWidth={2} />
            <span className="dc-learning-title">오답노트</span>
            <span className="dc-learning-description">작성한 노트 관리</span>
            <ArrowUpRight className="dc-learning-arrow" size={23} />
          </button>

          <button type="button" className="dc-learning-card dc-learning-card-wide" onClick={() => openPage('timer')}>
            <Clock3 className="dc-learning-icon" size={47} strokeWidth={2} />
            <span className="dc-learning-wide-copy">
              <span className="dc-learning-title">학습 기록</span>
              <span className="dc-learning-description">공부 시간 및 학습 기록</span>
            </span>
            <ArrowUpRight className="dc-learning-arrow" size={23} />
          </button>
        </div>
      </section>

      <section className="dc-account-management">
        <h2>2. 계정 관리</h2>
        <div className="dc-account-menu">
          <button type="button" className="dc-account-menu-row" onClick={openEditor}>
            <UserRoundPen size={26} className="dc-account-menu-icon" />
            <span>개인정보 수정</span>
            <ChevronRight size={24} className="dc-account-menu-chevron" />
          </button>
          <button type="button" className="dc-account-menu-row" onClick={() => onLogout?.()}>
            <LogOut size={25} className="dc-account-menu-icon" />
            <span>로그아웃</span>
            <ChevronRight size={24} className="dc-account-menu-chevron" />
          </button>
        </div>
      </section>

      <footer className="page-footer">DREAM CAMPUS <span>나의 꿈을 향한 시작</span></footer>

      {isEditing && (
        <div className="dc-profile-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsEditing(false);
        }}>
          <section className="dc-profile-modal" role="dialog" aria-modal="true" aria-labelledby="dc-profile-modal-title">
            <div className="dc-profile-modal-heading">
              <div>
                <span className="eyebrow">MY ACCOUNT</span>
                <h2 id="dc-profile-modal-title">개인정보 수정</h2>
                <p>프로필과 목표 대학 정보를 관리해 보세요.</p>
              </div>
              <button type="button" className="dc-profile-modal-close" onClick={() => setIsEditing(false)} aria-label="닫기">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={saveProfile} className="dc-profile-edit-form">
              <div className="dc-profile-edit-fields">
                <label className="dc-form-field">
                  이름
                  <input
                    type="text"
                    value={draft.name ?? authUser?.name ?? ''}
                    onChange={(event) => updateDraft('name', event.target.value)}
                    maxLength={20}
                    placeholder="이름을 입력해 주세요"
                  />
                </label>
                <label className="dc-form-field">
                  목표 대학
                  <input
                    list="dc-university-options"
                    type="text"
                    value={draft.university || ''}
                    onChange={(event) => updateDraft('university', event.target.value)}
                    maxLength={40}
                    placeholder="예: 고려대학교"
                  />
                  <datalist id="dc-university-options">
                    {universityOptions.map((university) => <option value={university} key={university} />)}
                  </datalist>
                </label>
                <label className="dc-form-field">
                  목표 학과
                  <input
                    type="text"
                    value={draft.major || ''}
                    onChange={(event) => updateDraft('major', event.target.value)}
                    maxLength={40}
                    placeholder="예: 컴퓨터소프트웨어학과"
                  />
                </label>
                <label className="dc-form-field">
                  입학 예정 연도
                  <input
                    type="number"
                    min="2026"
                    max="2035"
                    value={draft.admissionYear || ''}
                    onChange={(event) => updateDraft('admissionYear', event.target.value)}
                    placeholder="예: 2028"
                  />
                </label>
                <div className="dc-form-field dc-photo-field">
                  <span>프로필 사진</span>
                  <div className="dc-photo-controls">
                    <label className="dc-upload-button">
                      <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={photoLoading} />
                      <span><Camera size={15} /> {photoLoading ? '사진 처리 중...' : '사진 선택'}</span>
                    </label>
                    {draft.photo && (
                      <button type="button" className="dc-remove-photo" onClick={() => updateDraft('photo', '')}>사진 삭제</button>
                    )}
                  </div>
                  <small>사진은 카드 크기에 맞춰 자동으로 줄여 저장해.</small>
                </div>
                {notice && <p className="dc-profile-notice" role="status">{notice}</p>}
              </div>

              <div className="dc-student-preview-wrap">
                <div className="dc-student-preview-heading">
                  <span className="eyebrow">YOUR FUTURE CAMPUS</span>
                  <strong>미래 대학생 학생증</strong>
                </div>
                <div className="dc-print-area"><StudentIdCard profile={draft} /></div>
                <button type="button" className="dc-print-button" onClick={() => window.print()}>
                  학생증 인쇄하기 <FileText size={15} />
                </button>
              </div>

              <div className="dc-profile-edit-actions">
                <button type="button" className="dc-profile-cancel-button" onClick={() => setIsEditing(false)}>취소</button>
                <button type="submit" className="dc-save-profile-button" disabled={photoLoading}>
                  저장하기 <CheckCircle2 size={17} />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
