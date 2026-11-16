import React, { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Bell, BookOpenCheck, CalendarDays, TrendingUp,
  CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileText, Gamepad2,
  GraduationCap, Headphones, House, Landmark, ListChecks, Menu, Music2,
  Pencil, Plus, Trash2, Search, Settings2, Sparkles, Target, Trophy,
  UserRound, X,
} from 'lucide-react';
import { getLocalDateKey, getDdayInfo, getDateLabel, getUpcomingAdmissionEvents, getEventCategoryClass, getCalendarGridDays, CALENDAR_WEEKDAYS, isValidDateKey, ADMISSION_EVENT_CATEGORIES, sortAdmissionEvents, getUniversityTheme, resizeImageFile } from '../../utils/appUtils.js';
import StudentIdCard from '../../components/common/StudentIdCard.jsx';

export default function MyPage({ profile, onProfileChange }) {
  const [notice, setNotice] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const theme = getUniversityTheme(profile.university || '');

  const updateField = (field, value) => {
    onProfileChange((previous) => ({ ...previous, [field]: value }));
    setNotice('');
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true);
    setNotice('사진을 처리하고 있어...');
    try {
      const photo = await resizeImageFile(file);
      onProfileChange((previous) => ({ ...previous, photo }));
      setNotice('프로필 사진을 등록했어. 아래 학생증에 바로 반영돼!');
    } catch (error) {
      setNotice(error.message || '사진을 등록하지 못했어. 다른 파일을 선택해 줘.');
    } finally {
      setPhotoLoading(false);
      event.target.value = '';
    }
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setNotice('정보를 저장했어! 이 브라우저에 보관돼.');
  };

  return (
    <div className="page-content subpage-content dc-mypage">
      <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> MY PAGE</div>
      <section className="subpage-hero">
        <div className="subpage-icon"><UserRound size={30} /></div>
        <div><span className="eyebrow">MY PAGE</span><h1>나의 미래 캠퍼스</h1><p>희망하는 대학과 학과를 자유롭게 설정하고, 나만의 미래 학생증을 만들어 봐.</p></div>
      </section>

      <div className="dc-mypage-layout">
        <section className="panel dc-profile-form-panel">
          <div className="dc-panel-heading">
            <div><span className="eyebrow">MY PROFILE</span><h2>학생증 정보 등록</h2></div>
            <div className="dc-widget-icon"><Settings2 size={19} /></div>
          </div>
          <form onSubmit={saveProfile} className="dc-profile-form">
            <label className="dc-form-field">
              이름
              <input type="text" value={profile.name} onChange={(event) => updateField('name', event.target.value)} maxLength={20} placeholder="이름을 입력해 줘" />
            </label>
            <label className="dc-form-field">
              목표 대학
              <input list="dc-university-options" type="text" value={profile.university} onChange={(event) => updateField('university', event.target.value)} maxLength={40} placeholder="예: 서울대학교, 동양미래대학교" />
              <datalist id="dc-university-options">
                <option value="서울대학교" /><option value="연세대학교" /><option value="고려대학교" />
                <option value="성균관대학교" /><option value="한양대학교" /><option value="서강대학교" />
                <option value="중앙대학교" /><option value="경희대학교" /><option value="한국외국어대학교" />
                <option value="서울시립대학교" /><option value="건국대학교" /><option value="동국대학교" />
                <option value="홍익대학교" /><option value="국민대학교" /><option value="숭실대학교" />
                <option value="세종대학교" /><option value="단국대학교" /><option value="인하대학교" />
                <option value="아주대학교" /><option value="가천대학교" /><option value="경기대학교" />
                <option value="동양미래대학교" />
              </datalist>
              <small>목표 대학을 아직 정하지 않았다면 비워 둬도 괜찮아. 목록에서 고르거나 학교 이름을 직접 입력할 수 있어.</small>
            </label>
            <label className="dc-form-field">
              목표 학과
              <input type="text" value={profile.major} onChange={(event) => updateField('major', event.target.value)} maxLength={40} placeholder="예: 컴퓨터소프트웨어학과, 경영학과" />
            </label>
            <button type="button" className="dc-clear-goal-button" onClick={() => {
              onProfileChange((previous) => ({ ...previous, university: '', major: '' }));
              setNotice('목표 대학과 학과를 비웠어. 학생증과 메인 화면에도 바로 반영돼.');
            }}>목표 대학·학과 비우기</button>
            <label className="dc-form-field">
              입학 예정 연도
              <input type="number" min="2026" max="2035" value={profile.admissionYear} onChange={(event) => updateField('admissionYear', event.target.value)} />
            </label>
            <div className="dc-form-field dc-photo-field">
              <span>프로필 사진</span>
              <div className="dc-photo-controls">
                <label className="dc-upload-button">
                  <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={photoLoading} />
                  <span><FileText size={15} /> {photoLoading ? '사진 처리 중...' : '사진 선택'}</span>
                </label>
                {profile.photo && <button type="button" className="dc-remove-photo" onClick={() => updateField('photo', '')}>사진 삭제</button>}
              </div>
              <small>이미지 파일은 카드 크기에 맞춰 자동으로 줄여 저장해.</small>
            </div>
            {notice && <p className="dc-profile-notice" role="status">{notice}</p>}
            <button type="submit" className="dc-save-profile-button">정보 저장하기 <CheckCircle2 size={17} /></button>
          </form>
        </section>

        <section className="panel dc-student-preview-panel">
          <div className="dc-panel-heading">
            <div><span className="eyebrow">YOUR FUTURE CAMPUS</span><h2>미래 대학생 학생증</h2></div>
            <span className="dc-card-style-label">공통 디자인</span>
          </div>
          <div className="dc-print-area"><StudentIdCard profile={profile} /></div>
          <button type="button" className="dc-print-button" onClick={() => window.print()}>학생증 인쇄하기 <FileText size={16} /></button>
          <p className="dc-card-help">학교별 공식 로고를 사용하지 않는 DREAM CAMPUS 공통 디자인이야. 입력한 대학명과 학과, 입학 예정 연도, 사진이 카드에 반영돼.</p>
        </section>
      </div>
      <p className="dc-storage-note"><CheckCircle2 size={15} /> 등록한 정보는 현재 이 브라우저에 저장돼. 다른 기기와 공유하려면 추후 회원·서버 기능 연결이 필요해.</p>
      <footer className="page-footer">DREAM CAMPUS <span>나의 꿈을 향한 시작</span></footer>
    </div>
  );
}
