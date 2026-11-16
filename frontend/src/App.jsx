import React, { useEffect, useMemo, useState } from 'react';
import './MOCK_EXAM_styles.css';
import { getRegisteredAnswerKey } from './data/answerKeys';
import YeotGame from './components/YeotGame.jsx';
import './components/ArcadeMenu.css';
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpenCheck,
  CalendarDays,
  TrendingUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Gamepad2,
  GraduationCap,
  Headphones,
  House,
  Landmark,
  ListChecks,
  Menu,
  Music2,
  Pencil,
  Plus,
  Trash2,
  Search,
  Settings2,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  X,
} from 'lucide-react';



function createDefaultProfile() {
  return {
    name: '',
    university: '',
    major: '',
    admissionYear: String(new Date().getFullYear() + 1),
    photo: '',
    memberCode: `DC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  };
}

function normalizeProfile(value) {
  const defaults = createDefaultProfile();
  if (!value || typeof value !== 'object') return defaults;

  const normalized = { ...defaults, ...value };

  // 이전 디자인 시안에서 예시로 저장된 고려대학교 값이 남아 있는 경우를 정리함.
  // v3 마이그레이션은 한 번만 실행하므로, 정리 후 사용자가 고려대학교를 직접 선택해도 유지됨.
  const migrationKey = 'dream-campus-profile-demo-university-migrated-v3';
  try {
    if (window.localStorage.getItem(migrationKey) !== 'done') {
      const savedUniversity = String(normalized.university || '').trim();
      const oldDemoUniversities = new Set(['고려대학교', '고려대', 'Korea University']);
      if (oldDemoUniversities.has(savedUniversity)) {
        normalized.university = '';
        normalized.major = '';
      }
      window.localStorage.setItem(migrationKey, 'done');
    }
  } catch (error) {
    console.warn('목표 대학 기본값 정리 상태를 저장하지 못했어요.', error);
  }

  return normalized;
}

function usePersistentState(key, createInitialValue, normalize = (value) => value) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved === null ? normalize(createInitialValue()) : normalize(JSON.parse(saved));
    } catch (error) {
      console.warn(`저장 데이터(${key})를 불러오지 못했어요.`, error);
      return createInitialValue();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`저장 데이터(${key})를 저장하지 못했어요.`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDdayInfo(dateValue) {
  if (!dateValue) return { label: '--', description: '목표 날짜를 설정해 줘.' };
  const [year, month, day] = dateValue.split('-').map(Number);
  if (!year || !month || !day) return { label: '--', description: '날짜를 다시 확인해 줘.' };

  const target = Date.UTC(year, month - 1, day);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const difference = Math.round((target - today) / 86400000);
  const label = difference === 0 ? 'D-DAY' : difference > 0 ? `D-${difference}` : `D+${Math.abs(difference)}`;
  const description = difference === 0 ? '오늘이 목표 날짜야!' : difference > 0 ? '목표 날짜까지 남은 날' : '목표 날짜가 지난 지';
  return { label, description, difference };
}

function getDateLabel(dateValue) {
  if (!dateValue) return '날짜 미설정';
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '날짜 미설정';
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}


const ADMISSION_EVENT_CATEGORIES = ['모의고사', '수능', '논술', '면접', '원서접수', '합격 발표', '기타'];
const CALENDAR_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function isValidDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
  const [year, month, day] = String(value).split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function inferEventCategory(title) {
  const text = String(title || '').replace(/\s/g, '').toLowerCase();
  if (text.includes('모의고사') || text.includes('모평') || text.includes('모고')) return '모의고사';
  if (text.includes('수능')) return '수능';
  if (text.includes('논술')) return '논술';
  if (text.includes('면접')) return '면접';
  if (text.includes('원서')) return '원서접수';
  if (text.includes('합격')) return '합격 발표';
  return '기타';
}

function normalizeAdmissionEvents(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object' && isValidDateKey(item.date) && String(item.title || '').trim())
    .map((item, index) => ({
      id: String(item.id || `event-${index}-${item.date}`),
      title: String(item.title).trim().slice(0, 60),
      category: ADMISSION_EVENT_CATEGORIES.includes(item.category) ? item.category : inferEventCategory(item.title),
      date: item.date,
    }));
}

function createInitialAdmissionEvents() {
  // 이전 버전에서 저장한 D-Day 한 건은 새 일정 목록으로 옮겨 기존 사용자 입력을 보존함.
  // 단, 기본 안내 문구만 저장된 상태라면 가짜 일정을 만들지 않음.
  try {
    const legacyTitleRaw = window.localStorage.getItem('dream-campus-dday-title');
    const legacyDateRaw = window.localStorage.getItem('dream-campus-dday-date');
    if (!legacyTitleRaw || !legacyDateRaw) return [];
    const legacyTitle = JSON.parse(legacyTitleRaw);
    const legacyDate = JSON.parse(legacyDateRaw);
    if (!String(legacyTitle || '').trim() || legacyTitle === '나의 목표 일정' || !isValidDateKey(legacyDate)) return [];
    return [{
      id: `migrated-${Date.now()}`,
      title: String(legacyTitle).trim(),
      category: inferEventCategory(legacyTitle),
      date: legacyDate,
    }];
  } catch (error) {
    console.warn('이전 D-Day 정보를 옮기지 못했어요.', error);
    return [];
  }
}

function getCalendarDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCalendarGridDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
    return { date, dateKey: getCalendarDateKey(date), inMonth: date.getMonth() === month };
  });
}

function sortAdmissionEvents(events) {
  return [...events].sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'ko'));
}

function getUpcomingAdmissionEvents(events, limit = 3) {
  const today = getLocalDateKey();
  return sortAdmissionEvents(events).filter((event) => event.date >= today).slice(0, limit);
}

function getEventCategoryClass(category) {
  const classes = {
    '모의고사': 'mock', '수능': 'csat', '논술': 'essay', '면접': 'interview',
    '원서접수': 'application', '합격 발표': 'result', '기타': 'other',
  };
  return classes[category] || 'other';
}

function getUniversityTheme() {
  // 어느 대학을 목표로 하더라도 같은 DREAM CAMPUS 공통 카드 디자인을 사용함.
  // 실제 대학 로고나 공식 학생증 디자인을 사용한다는 의미는 아님.
  return { accent: '#8797B8', soft: '#EEF1F8' };
}

async function resizeImageFile(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('이미지 파일만 등록할 수 있어.');
  if (file.size > 8 * 1024 * 1024) throw new Error('사진은 8MB 이하 파일을 선택해 줘.');

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('사진을 읽지 못했어.'));
    reader.readAsDataURL(file);
  });

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const maxSize = 480;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext('2d');
      if (!context) return reject(new Error('사진을 처리하지 못했어.'));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    image.onerror = () => reject(new Error('사진을 불러오지 못했어.'));
    image.src = dataUrl;
  });
}

const navItems = [
  { id: 'home', label: '홈', icon: House },
  { id: 'mock', label: '모의고사 풀서비스', icon: FileText },
  { id: 'timer', label: '공부 타이머', icon: Clock3 },
  { id: 'campus', label: '대학교 및 학과 정보', icon: Landmark },
  { id: 'admission', label: '입시 캘린더', icon: CalendarDays },
  { id: 'playlist', label: '응원 플레이리스트', icon: Music2 },
  { id: 'arcade', label: '오락실 / 합격 응원', icon: Gamepad2 },
  { id: 'mypage', label: '마이페이지', icon: UserRound },
];

const quickMenus = [
  {
    id: 'mock',
    title: '모의고사 풀서비스',
    description: '답안 입력부터 성적 분석까지',
    icon: FileText,
    tone: 'wine',
    label: 'MOCK EXAM',
  },
  {
    id: 'timer',
    title: '공부 타이머',
    description: '나의 순공시간 기록하기',
    icon: Clock3,
    tone: 'sage',
    label: 'STUDY TIMER',
  },
  {
    id: 'campus',
    title: '대학교 정보',
    description: '대학 및 학과 찾아보기',
    icon: GraduationCap,
    tone: 'blue',
    label: 'CAMPUS',
  },
  {
    id: 'admission',
    title: '입시 캘린더',
    description: '주요 일정과 D-day 확인',
    icon: CalendarDays,
    tone: 'pink',
    label: 'ADMISSION',
  },
];

const pageInfo = {
  mock: {
    eyebrow: 'MOCK EXAM',
    title: '모의고사 풀서비스',
    description: '시험을 선택하고 답안을 입력해 나의 성적을 확인해 보세요.',
    icon: FileText,
    features: ['시험 회차 및 과목 선택', '답안 입력과 자동 채점', '등급컷 및 성적 분석', '오답노트와 해설 연결'],
  },
  timer: {
    eyebrow: 'STUDY TIMER',
    title: '공부 타이머',
    description: '과목별 순공시간을 기록하고 공부 습관을 확인해 보세요.',
    icon: Clock3,
    features: ['과목 선택 및 타이머 시작', '일시정지와 공부 종료', '일별·주별 공부 통계', '하루 공부 목표 설정'],
  },
  campus: {
    eyebrow: 'CAMPUS',
    title: '대학교 및 학과 정보',
    description: '관심 있는 대학교와 학과를 찾아보고 나의 목표를 정해 보세요.',
    icon: Landmark,
    features: ['서울 소재 대학 목록', '학교명 검색 및 유형별 필터', '대학별 학과 정보', '관심 대학 저장'],
  },
  admission: {
    eyebrow: 'ADMISSION',
    title: '입시 캘린더',
    description: '모의고사와 수시·정시 등 중요한 입시 일정을 한곳에서 관리해 보세요.',
    icon: CalendarDays,
    features: ['월별 입시 일정 확인', '모의고사 및 수능 D-day', '수시·정시 원서접수 일정', '나만의 일정 추가'],
  },
  playlist: {
    eyebrow: 'PLAYLIST',
    title: '수험생 응원 플레이리스트',
    description: '공부할 때, 지칠 때, 시험을 앞두고 들을 음악을 모아 보세요.',
    icon: Headphones,
    features: ['집중할 때 듣는 음악', '시험 전 긴장 완화 음악', '슬럼프 극복 플레이리스트', '외부 음악 서비스 연결'],
  },
  mypage: {
    eyebrow: 'MY PAGE',
    title: '마이페이지',
    description: '나의 목표 대학과 모의고사 성적, 공부 기록을 모아볼 수 있어요.',
    icon: UserRound,
    features: ['프로필 및 목표 대학 설정', '미래 학생증', '나의 모의고사 성적', '나의 공부 기록'],
  },
};

function App() {
  const [activePage, setActivePage] = useState('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [profile, setProfile] = usePersistentState('dream-campus-profile', createDefaultProfile, normalizeProfile);
  const [admissionEvents, setAdmissionEvents] = usePersistentState(
    'dream-campus-admission-events', createInitialAdmissionEvents, normalizeAdmissionEvents,
  );
  const [calendarFocusDate, setCalendarFocusDate] = useState(getLocalDateKey());
  const [goalsByDate, setGoalsByDate] = usePersistentState('dream-campus-daily-goals', () => ({}));
  const todayKey = getLocalDateKey();
  const dailyGoals = Array.isArray(goalsByDate[todayKey]) ? goalsByDate[todayKey] : [];

  const matchedMenus = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return [];
    return navItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [searchText]);

  // 앱 내부 화면 이동을 브라우저 방문 기록과 연결해 뒤로가기를 누르면 홈으로 돌아오게 함.
  useEffect(() => {
    const currentState = window.history.state || {};
    window.history.replaceState(
      { ...currentState, dreamCampusPage: 'home', dreamCampusBase: true },
      '',
      window.location.href,
    );

    const handlePopState = (event) => {
      const requestedPage = event.state?.dreamCampusPage;
      const validPage = navItems.some((item) => item.id === requestedPage);
      setActivePage(validPage ? requestedPage : 'home');
      setMobileNavOpen(false);
      setShowSearch(false);
      setSearchText('');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (id) => {
    const nextPage = navItems.some((item) => item.id === id) ? id : 'home';

    if (nextPage !== activePage) {
      if (nextPage === 'home' && window.history.state?.dreamCampusAppEntry) {
        // 메뉴의 홈 버튼도 브라우저 뒤로가기와 같은 흐름으로 홈에 복귀함.
        window.history.back();
        setActivePage('home');
      } else if (nextPage !== 'home') {
        const nextState = {
          ...(window.history.state || {}),
          dreamCampusPage: nextPage,
          dreamCampusAppEntry: true,
        };
        if (activePage === 'home') {
          window.history.pushState(nextState, '', window.location.href);
        } else {
          // 앱 내부의 다른 메뉴로 이동할 때는 한 단계의 뒤로가기로 홈에 복귀하도록 현재 항목을 교체함.
          window.history.replaceState(nextState, '', window.location.href);
        }
        setActivePage(nextPage);
      } else {
        setActivePage('home');
      }
    }

    setMobileNavOpen(false);
    setShowSearch(false);
    setSearchText('');
  };

  const addDailyGoal = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setGoalsByDate((previous) => {
      const current = Array.isArray(previous[todayKey]) ? previous[todayKey] : [];
      return {
        ...previous,
        [todayKey]: [...current, { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text: trimmed, done: false }],
      };
    });
  };

  const toggleDailyGoal = (goalId) => {
    setGoalsByDate((previous) => ({
      ...previous,
      [todayKey]: (Array.isArray(previous[todayKey]) ? previous[todayKey] : []).map((goal) =>
        goal.id === goalId ? { ...goal, done: !goal.done } : goal,
      ),
    }));
  };

  const removeDailyGoal = (goalId) => {
    setGoalsByDate((previous) => ({
      ...previous,
      [todayKey]: (Array.isArray(previous[todayKey]) ? previous[todayKey] : []).filter((goal) => goal.id !== goalId),
    }));
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {mobileNavOpen && <button className="mobile-backdrop" aria-label="메뉴 닫기" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup" onClick={() => navigate('home')} role="button" tabIndex={0}>
          <div className="brand-mark"><GraduationCap size={27} strokeWidth={2.2} /></div>
          <div>
            <div className="brand-name">DREAM<br />CAMPUS</div>
            <div className="brand-caption">나의 꿈을 향한 시작</div>
          </div>
        </div>
        <button
          type="button"
          className="sidebar-collapse-toggle"
          onClick={() => setSidebarCollapsed((previous) => !previous)}
          aria-label={sidebarCollapsed ? '메뉴 펼치기' : '메뉴 접기'}
          aria-expanded={!sidebarCollapsed}
          title={sidebarCollapsed ? '메뉴 펼치기' : '메뉴 접기'}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="sidebar-label">MENU</div>
        <nav className="side-nav" aria-label="주요 메뉴">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => navigate(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                aria-label={item.label}
              >
                <Icon size={19} strokeWidth={2} />
                <span>{item.label}</span>
                {activePage === item.id && <span className="active-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-campus-icon" aria-hidden="true"><GraduationCap size={36} /></div>
          <p>오늘도 한 걸음씩!<br /><span>너의 꿈을 응원해 ♡</span></p>
          <div className="sidebar-foot">DREAM CAMPUS · 2026</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu-button icon-button" onClick={() => setMobileNavOpen(true)} aria-label="메뉴 열기">
            <Menu size={20} />
          </button>
          {activePage !== 'home' && (
            <button className="app-home-back-button icon-button" onClick={() => navigate('home')} aria-label="메인 화면으로 돌아가기" title="메인 화면으로">
              <ChevronLeft size={19} />
            </button>
          )}
          <div className="search-wrap">
            <Search size={18} />
            <input
              value={searchText}
              onChange={(event) => { setSearchText(event.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && matchedMenus[0]) navigate(matchedMenus[0].id);
                if (event.key === 'Escape') setShowSearch(false);
              }}
              placeholder="원하는 메뉴를 검색해 보세요"
              aria-label="메뉴 검색"
            />
            {searchText && <button className="clear-search" onClick={() => setSearchText('')} aria-label="검색어 지우기"><X size={15} /></button>}
            {showSearch && searchText.trim() && (
              <div className="search-results">
                {matchedMenus.length ? matchedMenus.map((item) => (
                  <button key={item.id} onClick={() => navigate(item.id)}>{item.label}<ArrowUpRight size={15} /></button>
                )) : <span>검색 결과가 없어요.</span>}
              </div>
            )}
          </div>
          <div className="topbar-right">
            <span className="topbar-date">나의 입시·학습 관리</span>
            <button className="icon-button notification-button" aria-label="알림"><Bell size={19} /><i /></button>
            <button className="profile-button" onClick={() => navigate('mypage')} aria-label="마이페이지">
              {profile.photo ? <img src={profile.photo} alt="프로필" /> : <UserRound size={19} />}
            </button>
          </div>
        </header>

        {activePage === 'home' ? (
          <HomePage
            onNavigate={navigate}
            onOpenCalendar={(dateKey) => { setCalendarFocusDate(dateKey || getLocalDateKey()); navigate('admission'); }}
            profile={profile}
            dailyGoals={dailyGoals}
            onAddGoal={addDailyGoal}
            onToggleGoal={toggleDailyGoal}
            onRemoveGoal={removeDailyGoal}
            admissionEvents={admissionEvents}
          />
        ) : activePage === 'mock' ? (
          <MockExamPage />
        ) : activePage === 'mypage' ? (
          <MyPage profile={profile} onProfileChange={setProfile} />
        ) : activePage === 'admission' ? (
          <AdmissionCalendarPage events={admissionEvents} onEventsChange={setAdmissionEvents} initialDate={calendarFocusDate} />
        ) : activePage === 'arcade' ? (
          <ArcadePage universityName={profile.university} onNavigate={navigate} />
        ) : (
          <PlaceholderPage pageId={activePage} onBack={() => navigate('home')} />
        )}
      </main>
    </div>
  );
}

function HomePage({ onNavigate, onOpenCalendar, profile, dailyGoals, onAddGoal, onToggleGoal, onRemoveGoal, admissionEvents }) {
  const [goalDraft, setGoalDraft] = useState('');
  const completedGoals = dailyGoals.filter((goal) => goal.done).length;
  const goalProgress = dailyGoals.length ? Math.round((completedGoals / dailyGoals.length) * 100) : 0;
  const nearestEvent = getUpcomingAdmissionEvents(admissionEvents, 1)[0] || null;
  const nextEvents = getUpcomingAdmissionEvents(admissionEvents, 4);

  const submitGoal = (event) => {
    event.preventDefault();
    if (!goalDraft.trim()) return;
    onAddGoal(goalDraft);
    setGoalDraft('');
  };

  return (
    <div className="page-content dc-home-page">
      <section className="dc-home-welcome-row">
        <div className="dc-home-welcome-copy">
          <span className="dc-home-welcome-kicker"><Sparkles size={14} /> WELCOME TO DREAM CAMPUS</span>
          <h1>오늘도 꿈을 향해,<br /><em>한 걸음씩 나아가고 있어요.</em></h1>
          <p>나만의 입시 일정과 공부 목표를 차근차근 관리해 봐요.</p>
        </div>
        <button type="button" className="dc-home-target-card" onClick={() => onNavigate('mypage')}>
          <span className="dc-home-target-icon"><GraduationCap size={25} /></span>
          <span className="dc-home-target-copy">
            <small>MY FUTURE CAMPUS</small>
            <strong>{profile.university || '목표 대학을 설정해 보세요'}</strong>
            <span>{profile.major || '대학과 학과는 언제든지 변경할 수 있어요.'}</span>
          </span>
          <span className="dc-home-target-action">{profile.university ? '수정하기' : '설정하기'} <ChevronRight size={15} /></span>
        </button>
      </section>

      <section className="section-block quick-section dc-home-quick-section">
        <div className="section-heading">
          <div><span className="heading-star">✦</span><h2>QUICK MENU</h2><p>자주 사용하는 기능을 빠르게 이용해 보세요.</p></div>
          <span className="section-count">DREAM CAMPUS</span>
        </div>
        <div className="quick-grid">
          {quickMenus.map((item) => {
            const Icon = item.icon;
            return (
              <button className={`quick-card ${item.tone}`} key={item.id} onClick={() => onNavigate(item.id)}>
                <div className="quick-card-top"><span>{item.label}</span><ArrowUpRight size={17} /></div>
                <div className="quick-icon"><Icon size={30} strokeWidth={1.8} /></div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span className="quick-arrow"><ChevronRight size={17} /></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="dc-dashboard-grid" aria-label="오늘의 입시 및 학습 목표">
        <div className="panel dc-dday-widget dc-home-dday-widget">
          <div className="dc-widget-heading">
            <div className="dc-widget-icon lavender"><CalendarDays size={19} /></div>
            <div><span className="eyebrow">MY D-DAY</span><h3>가장 가까운 일정</h3></div>
            <button type="button" className="dc-inline-manage-button" onClick={() => onOpenCalendar(nearestEvent?.date || getLocalDateKey())}>
              일정 관리하기 <ChevronRight size={15} />
            </button>
          </div>
          {nearestEvent ? (
            <div className="dc-home-nearest-event">
              <div className="dc-home-dday-number">{getDdayInfo(nearestEvent.date).label}</div>
              <div className="dc-home-nearest-copy">
                <span className={`dc-event-category-pill ${getEventCategoryClass(nearestEvent.category)}`}>{nearestEvent.category}</span>
                <strong>{nearestEvent.title}</strong>
                <span>{getDateLabel(nearestEvent.date)}</span>
              </div>
            </div>
          ) : (
            <div className="dc-home-empty-dday">
              <strong>아직 등록한 일정이 없어요.</strong>
              <span>모의고사, 수능, 논술, 면접 등 원하는 일정을 추가해 보세요.</span>
              <button type="button" onClick={() => onOpenCalendar(getLocalDateKey())}><Plus size={15} /> 첫 일정 등록하기</button>
            </div>
          )}
        </div>

        <div className="panel dc-goals-widget">
          <div className="dc-goals-heading-row">
            <div className="dc-widget-heading">
              <div className="dc-widget-icon sage"><ListChecks size={19} /></div>
              <div><span className="eyebrow">TODAY'S PLAN</span><h3>오늘의 공부 목표</h3></div>
            </div>
            <span className="dc-goal-count">{completedGoals}/{dailyGoals.length} 완료</span>
          </div>
          <div className="dc-goal-progress"><span style={{ width: `${goalProgress}%` }} /></div>
          <form className="dc-goal-form" onSubmit={submitGoal}>
            <input value={goalDraft} onChange={(event) => setGoalDraft(event.target.value)} maxLength={80} placeholder="예: 수학 기출문제 20개 풀기" aria-label="공부 목표 입력" />
            <button type="submit" disabled={!goalDraft.trim()}>추가</button>
          </form>
          {dailyGoals.length ? (
            <ul className="dc-goal-list">
              {dailyGoals.map((goal) => (
                <li key={goal.id} className={goal.done ? 'is-done' : ''}>
                  <label><input type="checkbox" checked={goal.done} onChange={() => onToggleGoal(goal.id)} /><span>{goal.text}</span></label>
                  <button type="button" onClick={() => onRemoveGoal(goal.id)} aria-label={`${goal.text} 삭제`}><X size={15} /></button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dc-empty-goals">아직 등록한 목표가 없어. 오늘 할 일을 하나 추가해 봐!</p>
          )}
          <div className="dc-goals-footer"><span>오늘 목표 달성률</span><strong>{goalProgress}%</strong></div>
        </div>
      </section>

      <section className="dc-home-calendar-grid">
        <MiniAdmissionCalendar events={admissionEvents} onOpenCalendar={onOpenCalendar} />
        <div className="panel dc-upcoming-widget">
          <div className="dc-calendar-panel-heading">
            <div><span className="dc-calendar-heading-icon"><CalendarDays size={18} /></span><div><span className="eyebrow">UPCOMING</span><h3>다가오는 일정</h3></div></div>
            <button type="button" onClick={() => onOpenCalendar(getLocalDateKey())}>전체 보기 <ChevronRight size={15} /></button>
          </div>
          {nextEvents.length ? (
            <div className="dc-upcoming-list">
              {nextEvents.slice(0, 4).map((item) => (
                <button type="button" className="dc-upcoming-row" key={item.id} onClick={() => onOpenCalendar(item.date)}>
                  <span className={`dc-event-dot ${getEventCategoryClass(item.category)}`} />
                  <span className="dc-upcoming-main"><strong>{item.title}</strong><small>{item.category} · {getDateLabel(item.date)}</small></span>
                  <span className={`dc-upcoming-dday ${getEventCategoryClass(item.category)}`}>{getDdayInfo(item.date).label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="dc-calendar-empty-state"><CalendarDays size={25} /><p>아직 다가오는 일정이 없어요.</p><span>일정을 등록하면 이곳에 표시돼요.</span></div>
          )}
          <button type="button" className="dc-upcoming-add-button" onClick={() => onOpenCalendar(getLocalDateKey())}><Plus size={15} /> 일정 추가하기</button>
        </div>
      </section>

      <section className="lower-grid">
        <div className="panel playlist-panel">
          <div className="playlist-art"><Headphones size={34} /><span className="sound-wave">▂ ▄ ▆ ▃ ▇ ▄ ▂</span></div>
          <div className="playlist-copy">
            <span className="eyebrow">A LITTLE ENERGY FOR TODAY</span>
            <h3>수험생 응원 플레이리스트</h3>
            <p>공부할 때 듣기 좋은 음악을 모아봤어요.</p>
            <button className="text-button" onClick={() => onNavigate('playlist')}>플레이리스트 보기 <ArrowRight size={14} /></button>
          </div>
          <div className="play-circle"><Music2 size={21} /></div>
        </div>

        <div className="panel study-summary">
          <div className="panel-heading"><div><TrendingUp size={19} /><h3>나의 공부 현황</h3></div><button onClick={() => onNavigate('timer')}>타이머 가기 <ChevronRight size={15} /></button></div>
          <div className="study-summary-main"><div><span>오늘의 순공시간</span><strong>00<span>시간</span> 00<span>분</span></strong></div><div className="summary-ring"><span>0%</span></div></div>
          <div className="goal-progress-label"><span>하루 목표 5시간</span><b>0 / 300분</b></div>
          <div className="progress-track"><span /></div>
          <p className="data-notice">공부 타이머 기능과 연결하면 실제 공부 시간이 표시돼.</p>
        </div>
      </section>

      <footer className="page-footer">DREAM CAMPUS <span>나의 꿈을 향한 시작</span></footer>
    </div>
  );
}

function MiniAdmissionCalendar({ events, onOpenCalendar }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const cells = getCalendarGridDays(visibleMonth);
  const todayKey = getLocalDateKey();
  const monthLabel = visibleMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });

  return (
    <div className="panel dc-mini-calendar">
      <div className="dc-calendar-panel-heading">
        <div><span className="dc-calendar-heading-icon"><CalendarDays size={18} /></span><div><span className="eyebrow">ADMISSION SCHEDULE</span><h3>입시 캘린더</h3></div></div>
        <button type="button" onClick={() => onOpenCalendar(todayKey)}>전체 보기 <ChevronRight size={15} /></button>
      </div>
      <div className="dc-mini-month-controls">
        <button type="button" aria-label="이전 달" onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={17} /></button>
        <strong>{monthLabel}</strong>
        <button type="button" aria-label="다음 달" onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={17} /></button>
      </div>
      <div className="dc-mini-calendar-grid dc-weekday-row">
        {CALENDAR_WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="dc-mini-calendar-grid">
        {cells.map(({ dateKey, date, inMonth }) => {
          const dayEvents = events.filter((event) => event.date === dateKey);
          return (
            <button type="button" key={dateKey} className={`dc-mini-day ${inMonth ? '' : 'outside'} ${dateKey === todayKey ? 'today' : ''} ${dayEvents.length ? 'has-events' : ''}`} onClick={() => onOpenCalendar(dateKey)} aria-label={`${dateKey}${dayEvents.length ? ` 일정 ${dayEvents.length}개` : ''}`}>
              <span>{date.getDate()}</span>
              {dayEvents.length > 0 && <i className={`dc-mini-day-dot ${getEventCategoryClass(dayEvents[0].category)}`} />}
            </button>
          );
        })}
      </div>
      <p className="dc-mini-calendar-hint">날짜를 누르면 해당 날짜의 일정을 확인할 수 있어요.</p>
    </div>
  );
}

function AdmissionCalendarPage({ events, onEventsChange, initialDate }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = isValidDateKey(initialDate) ? new Date(`${initialDate}T00:00:00`) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => isValidDateKey(initialDate) ? initialDate : getLocalDateKey());
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', category: '모의고사', date: isValidDateKey(initialDate) ? initialDate : getLocalDateKey() });
  const [notice, setNotice] = useState('');
  const cells = getCalendarGridDays(visibleMonth);
  const monthLabel = visibleMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  const selectedDayEvents = sortAdmissionEvents(events.filter((event) => event.date === selectedDate));
  const upcoming = getUpcomingAdmissionEvents(events, 8);

  const changeMonth = (amount) => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + amount, 1));
  const openNewForm = (dateKey = selectedDate) => {
    setEditingId(null);
    setForm({ title: '', category: '모의고사', date: isValidDateKey(dateKey) ? dateKey : selectedDate });
    setNotice('');
    setFormOpen(true);
  };
  const openEditForm = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title, category: item.category, date: item.date });
    setSelectedDate(item.date);
    setVisibleMonth(new Date(`${item.date}T00:00:00`));
    setNotice('');
    setFormOpen(true);
  };
  const saveEvent = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) { setNotice('일정 이름을 입력해 줘.'); return; }
    if (!isValidDateKey(form.date)) { setNotice('올바른 날짜를 선택해 줘.'); return; }
    const nextEvent = {
      id: editingId || `event-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      category: ADMISSION_EVENT_CATEGORIES.includes(form.category) ? form.category : '기타',
      date: form.date,
    };
    onEventsChange((previous) => editingId
      ? previous.map((item) => item.id === editingId ? nextEvent : item)
      : [...previous, nextEvent]);
    setSelectedDate(form.date);
    setVisibleMonth(new Date(`${form.date}T00:00:00`));
    setFormOpen(false);
    setEditingId(null);
    setNotice('일정을 저장했어. 메인 화면에도 자동으로 반영돼!');
  };
  const deleteEvent = (eventId) => {
    const target = events.find((item) => item.id === eventId);
    if (!target) return;
    if (!window.confirm(`'${target.title}' 일정을 삭제할까?`)) return;
    onEventsChange((previous) => previous.filter((item) => item.id !== eventId));
    setFormOpen(false);
    setEditingId(null);
    setNotice('일정을 삭제했어.');
  };

  return (
    <div className="page-content subpage-content dc-admission-page">
      <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> ADMISSION CALENDAR</div>
      <section className="subpage-hero dc-admission-hero">
        <div className="subpage-icon"><CalendarDays size={30} /></div>
        <div><span className="eyebrow">MY ADMISSION PLAN</span><h1>나의 입시 캘린더</h1><p>모의고사, 수능, 논술, 면접, 원서 접수까지 나만의 일정을 관리해 보세요.</p></div>
        <button type="button" className="dc-admission-add-main" onClick={() => openNewForm(selectedDate)}><Plus size={16} /> 일정 추가</button>
      </section>

      <div className="dc-admission-layout">
        <section className="panel dc-admission-calendar-panel">
          <div className="dc-admission-month-heading">
            <div><span className="eyebrow">MONTHLY CALENDAR</span><h2>{monthLabel}</h2></div>
            <div className="dc-admission-month-actions">
              <button type="button" onClick={() => changeMonth(-1)} aria-label="이전 달"><ChevronLeft size={19} /></button>
              <button type="button" onClick={() => { const today = new Date(); setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(getLocalDateKey()); }} className="dc-today-button">오늘</button>
              <button type="button" onClick={() => changeMonth(1)} aria-label="다음 달"><ChevronRight size={19} /></button>
            </div>
          </div>
          <div className="dc-admission-calendar-grid dc-admission-weekdays">
            {CALENDAR_WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="dc-admission-calendar-grid dc-admission-days">
            {cells.map(({ date, dateKey, inMonth }) => {
              const dayEvents = events.filter((item) => item.date === dateKey);
              return (
                <button type="button" key={dateKey} className={`dc-admission-day ${inMonth ? '' : 'outside'} ${dateKey === selectedDate ? 'selected' : ''} ${dateKey === getLocalDateKey() ? 'today' : ''}`} onClick={() => { setSelectedDate(dateKey); setNotice(''); if (!inMonth) setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1)); }}>
                  <span className="dc-admission-day-number">{date.getDate()}</span>
                  {dayEvents.length > 0 && <span className="dc-admission-day-events">{dayEvents.slice(0, 3).map((item) => <i key={item.id} className={getEventCategoryClass(item.category)} />)}</span>}
                  {dayEvents.length > 0 && <small>{dayEvents.length}개</small>}
                </button>
              );
            })}
          </div>
          <div className="dc-admission-legend">
            {ADMISSION_EVENT_CATEGORIES.slice(0, 6).map((category) => <span key={category}><i className={getEventCategoryClass(category)} />{category}</span>)}
          </div>
        </section>

        <aside className="dc-admission-side-column">
          {formOpen ? (
            <section className="panel dc-event-form-panel">
              <div className="dc-event-form-heading"><div><span className="eyebrow">{editingId ? 'EDIT SCHEDULE' : 'NEW SCHEDULE'}</span><h2>{editingId ? '일정 수정하기' : '새 일정 등록'}</h2></div><button type="button" onClick={() => setFormOpen(false)} aria-label="입력 닫기"><X size={18} /></button></div>
              <form onSubmit={saveEvent} className="dc-event-form">
                <label>일정 이름<input autoFocus value={form.title} onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))} maxLength={60} placeholder="예: 6월 모의평가, 논술고사" /></label>
                <label>일정 종류<select value={form.category} onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}>{ADMISSION_EVENT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
                <label>날짜<input type="date" value={form.date} onChange={(event) => setForm((previous) => ({ ...previous, date: event.target.value }))} /></label>
                {notice && <p className="dc-event-form-notice" role="status">{notice}</p>}
                <div className="dc-event-form-actions">
                  <button type="button" className="dc-event-cancel-button" onClick={() => setFormOpen(false)}>취소</button>
                  {editingId && <button type="button" className="dc-event-delete-button" onClick={() => deleteEvent(editingId)}><Trash2 size={15} /> 삭제</button>}
                  <button type="submit" className="dc-event-save-button">저장하기 <CheckCircle2 size={15} /></button>
                </div>
              </form>
            </section>
          ) : (
            <section className="panel dc-selected-day-panel">
              <div className="dc-selected-day-heading"><div><span className="eyebrow">SELECTED DATE</span><h2>{getDateLabel(selectedDate)}</h2></div><button type="button" onClick={() => openNewForm(selectedDate)}><Plus size={15} /> 추가</button></div>
              {selectedDayEvents.length ? (
                <div className="dc-selected-events-list">
                  {selectedDayEvents.map((item) => (
                    <div className="dc-selected-event-row" key={item.id}>
                      <span className={`dc-event-dot ${getEventCategoryClass(item.category)}`} />
                      <div><strong>{item.title}</strong><small>{item.category}</small></div>
                      <button type="button" onClick={() => openEditForm(item)} aria-label={`${item.title} 수정`}><Pencil size={15} /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dc-selected-day-empty"><CalendarDays size={28} /><p>이 날짜에는 등록된 일정이 없어.</p><span>일정을 추가해서 나만의 입시 계획을 만들어 봐.</span></div>
              )}
              <button type="button" className="dc-selected-day-add" onClick={() => openNewForm(selectedDate)}><Plus size={15} /> 이 날짜에 일정 추가</button>
            </section>
          )}

          <section className="panel dc-admission-upcoming-panel">
            <div className="dc-selected-day-heading"><div><span className="eyebrow">UPCOMING</span><h2>다가오는 일정</h2></div><span>{upcoming.length}개</span></div>
            {upcoming.length ? (
              <div className="dc-selected-events-list compact">
                {upcoming.slice(0, 5).map((item) => (
                  <button type="button" className="dc-upcoming-compact-row" key={item.id} onClick={() => { setSelectedDate(item.date); setVisibleMonth(new Date(`${item.date}T00:00:00`)); setFormOpen(false); }}>
                    <span className={`dc-event-dot ${getEventCategoryClass(item.category)}`} />
                    <span><strong>{item.title}</strong><small>{item.category} · {getDateLabel(item.date)}</small></span>
                    <b>{getDdayInfo(item.date).label}</b>
                  </button>
                ))}
              </div>
            ) : <p className="dc-no-upcoming">등록한 일정이 생기면 이곳에서 확인할 수 있어.</p>}
          </section>
        </aside>
      </div>
      {notice && !formOpen && <p className="dc-calendar-page-notice" role="status">{notice}</p>}
      <p className="dc-calendar-data-note">※ 현재 캘린더는 직접 등록한 일정과 기존 D-Day 저장 정보를 표시해. 공식 입시 일정 자동 업데이트 기능은 아직 연결되어 있지 않아.</p>
      <footer className="page-footer">DREAM CAMPUS <span>나의 꿈을 향한 시작</span></footer>
    </div>
  );
}

function MockExamPage() {
  // 고3 전용 모의고사 선택 및 OMR 답안 입력 화면
  const [year, setYear] = useState('2027학년도');
  const [month, setMonth] = useState('9월');
  const [koreanOption, setKoreanOption] = useState('');
  const [mathOption, setMathOption] = useState('');
  const [selectedInquiries, setSelectedInquiries] = useState([]);

  const [view, setView] = useState('selection');
  const [activeSubjectKey, setActiveSubjectKey] = useState(null);
  const [draftChoiceAnswers, setDraftChoiceAnswers] = useState('');
  const [draftMathAnswers, setDraftMathAnswers] = useState(Array(30).fill(''));
  const [savedAnswers, setSavedAnswers] = useState({});
  const [gradeResult, setGradeResult] = useState(null);
  const [message, setMessage] = useState('');

  const years = ['2027학년도', '2026학년도', '2025학년도', '2024학년도'];
  // 고3 모의평가 및 수능에서 사용하는 대표 시행 월. 실제 회차는 학년도별로 확인해야 함.
  const months = ['3월', '5월', '6월', '7월', '9월', '10월', '11월'];
  const koreanOptions = ['화법과 작문', '언어와 매체'];
  const mathOptions = ['확률과 통계', '미적분', '기하'];
  const socialStudies = [
    '생활과 윤리', '윤리와 사상', '한국지리', '세계지리', '동아시아사',
    '세계사', '경제', '정치와 법', '사회·문화',
  ];
  const scienceStudies = [
    '물리학Ⅰ', '화학Ⅰ', '생명과학Ⅰ', '지구과학Ⅰ',
    '물리학Ⅱ', '화학Ⅱ', '생명과학Ⅱ', '지구과학Ⅱ',
  ];

  const selectedExamText = `${year} · 고3 · ${month}`;
  const activeSubjects = [
    { key: 'korean', name: '국어', detail: koreanOption, questionCount: 45, type: 'choice', note: '공통 34문항 + 선택 11문항' },
    { key: 'math', name: '수학', detail: mathOption, questionCount: 30, type: 'math', note: '객관식 21문항 + 단답형 9문항' },
    { key: 'english', name: '영어', detail: '듣기 17문항 포함', questionCount: 45, type: 'choice', note: '5지선다형 45문항' },
    { key: 'history', name: '한국사', detail: '필수 응시', questionCount: 20, type: 'choice', note: '5지선다형 20문항' },
    ...selectedInquiries.map((name, index) => ({
      key: `inquiry-${name}`,
      name,
      detail: '사회·과학탐구',
      questionCount: 20,
      type: 'choice',
      note: '5지선다형 20문항',
      order: index + 1,
    })),
  ];

  const currentSubject = activeSubjects.find((item) => item.key === activeSubjectKey);
  const answeredCount = currentSubject?.type === 'math'
    ? draftMathAnswers.filter((answer) => answer !== '').length
    : draftChoiceAnswers.length;
  const savedCount = activeSubjects.filter((item) => Object.prototype.hasOwnProperty.call(savedAnswers, item.key)).length;

  const clearSavedAnswers = () => {
    setSavedAnswers({});
    setGradeResult(null);
    setMessage('');
  };

  const handleInquiryToggle = (name) => {
    setSelectedInquiries((previous) => {
      if (previous.includes(name)) {
        return previous.filter((item) => item !== name);
      }
      if (previous.length >= 2) {
        setMessage('탐구 과목은 사회·과학 17개 중 최대 2개까지 선택할 수 있어.');
        return previous;
      }
      setMessage('');
      return [...previous, name];
    });
    clearSavedAnswers();
  };

  const handleChoiceAnswerChange = (event) => {
    const cleaned = event.target.value.replace(/[^1-5]/g, '').slice(0, currentSubject.questionCount);
    setDraftChoiceAnswers(cleaned);
    setMessage('');
  };

  const handleMathAnswerChange = (index, value) => {
    // 2027학년도 수능 수학: 30문항 중 30%인 9문항이 단답형
    // 기본 입력 구분은 1~21번 객관식, 22~30번 단답형으로 구성함.
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
    if (!koreanOption || !mathOption) {
      setMessage('국어와 수학 선택과목을 각각 하나씩 선택해 줘.');
      return;
    }
    if (selectedInquiries.length < 1 || selectedInquiries.length > 2) {
      setMessage('사회·과학탐구 17개 과목 중 1~2개를 선택해 줘.');
      return;
    }
    clearSavedAnswers();
    setView('subjects');
  };

  const saveCurrentAnswers = () => {
    if (!currentSubject) return;
    if (answeredCount !== currentSubject.questionCount) {
      setMessage(`아직 ${currentSubject.questionCount - answeredCount}문항이 비어 있어. 모든 답안을 입력해 줘.`);
      return;
    }

    const valueToSave = currentSubject.type === 'math' ? [...draftMathAnswers] : draftChoiceAnswers;
    setSavedAnswers((previous) => ({ ...previous, [currentSubject.key]: valueToSave }));
    setMessage('');

    // 현재 정답 등록 범위: 2027학년도 9월 모의평가 고3 국어
    const answerKey = currentSubject.key === 'korean'
      ? getRegisteredAnswerKey(year, month, 'korean', koreanOption)
      : null;

    if (answerKey && typeof valueToSave === 'string') {
      const submitted = valueToSave.split('');
      const details = answerKey.map((correctAnswer, index) => ({
        number: index + 1,
        submitted: submitted[index],
        correct: String(correctAnswer),
        isCorrect: submitted[index] === String(correctAnswer),
      }));
      const correctCount = details.filter((item) => item.isCorrect).length;
      const wrongQuestions = details.filter((item) => !item.isCorrect).map((item) => item.number);
      setGradeResult({
        examTitle: `${year} 9월 모의평가`,
        subjectName: '국어',
        optionName: koreanOption,
        totalCount: answerKey.length,
        correctCount,
        wrongCount: answerKey.length - correctCount,
        accuracy: Math.round((correctCount / answerKey.length) * 100),
        wrongQuestions,
        details,
        submittedAnswers: valueToSave,
      });
      setView('result');
      return;
    }

    setGradeResult(null);
    setView('subjects');
  };

  const changeExamSelection = () => {
    setView('selection');
    setActiveSubjectKey(null);
    setMessage('');
  };

  const resetCurrentAnswers = () => {
    if (currentSubject?.type === 'math') setDraftMathAnswers(Array(30).fill(''));
    else setDraftChoiceAnswers('');
    setMessage('');
  };

  if (view === 'result' && gradeResult) {
    return (
      <div className="page-content subpage-content mock-page omr-page">
        <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> MOCK EXAM <ChevronRight size={14} /> 채점 결과</div>
        <section className="mock-selection-panel omr-result-panel">
          <div className="omr-result-icon"><CheckCircle2 size={32} /></div>
          <span className="eyebrow">AUTO GRADING COMPLETE</span>
          <h1>국어 채점 결과</h1>
          <p>{gradeResult.examTitle} · 고3 · {gradeResult.optionName}</p>
          <div className="omr-grade-metrics">
            <div className="omr-grade-metric primary"><span>정답 문항</span><strong>{gradeResult.correctCount}<small> / {gradeResult.totalCount}</small></strong></div>
            <div className="omr-grade-metric"><span>정답률</span><strong>{gradeResult.accuracy}<small>%</small></strong></div>
            <div className="omr-grade-metric"><span>오답 문항</span><strong>{gradeResult.wrongCount}<small>개</small></strong></div>
          </div>
          <div className="omr-result-section-title">문항별 채점 결과</div>
          <div className="omr-answer-grid omr-graded-answer-grid">
            {gradeResult.details.map((item) => (
              <div className={`omr-answer-cell ${item.isCorrect ? 'is-correct' : 'is-wrong'}`} key={item.number}>
                <small>{item.number}번</small><strong>{item.isCorrect ? '정답' : '오답'}</strong>
                {!item.isCorrect && <em>내 답 {item.submitted} · 정답 {item.correct}</em>}
              </div>
            ))}
          </div>
          <div className="omr-key-notice">
            <strong>{gradeResult.wrongQuestions.length ? `틀린 문항: ${gradeResult.wrongQuestions.join(', ')}번` : '45문항 모두 정답이야! 🎉'}</strong>
            <p>첨부한 정답표 이미지의 답과 네가 입력한 답안을 문항별로 비교했어.</p>
          </div>
          <div className="omr-key-notice omr-score-caveat">
            <strong>현재는 정답 개수와 정답률만 계산했어.</strong>
            <p>첨부한 정답표 이미지에는 문항별 배점이 없어서 100점 원점수는 아직 계산하지 않았어. 배점표를 확인한 뒤 추가할게.</p>
          </div>
          <div className="omr-result-actions">
            <button type="button" className="mock-secondary-button" onClick={() => openAnswerSheet('korean')}>답안 수정하기</button>
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

        <section className="mock-heading">
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
              <h2>답안을 입력해 줘</h2>
              {currentSubject.type === 'math'
                ? <p>1~21번은 객관식, 22~30번은 단답형으로 입력해. 실제 회차의 문항 형식은 정답 자료 등록 시 다시 확인할 거야.</p>
                : <p>1번부터 {currentSubject.questionCount}번까지 정답 번호를 순서대로 입력하면 돼.</p>}
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
              <label className="omr-input-label" htmlFor="omr-answer-input">내 답안</label>
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
                <span>숫자 1~5만 입력 가능</span>
                <strong>{answeredCount} / {currentSubject.questionCount}문항</strong>
              </div>
              <div className="omr-progress-track"><span style={{ width: `${(answeredCount / currentSubject.questionCount) * 100}%` }} /></div>
              <div className="omr-number-preview-title">
                <strong>입력 확인</strong>
                <span>입력한 답안이 문항 순서대로 표시돼.</span>
              </div>
              <div className="omr-answer-grid">
                {Array.from({ length: currentSubject.questionCount }, (_, index) => (
                  <div className={`omr-answer-cell ${draftChoiceAnswers[index] ? 'filled' : ''}`} key={index}>
                    <small>{index + 1}</small>
                    <strong>{draftChoiceAnswers[index] || '·'}</strong>
                  </div>
                ))}
              </div>
            </>
          )}

          {message && <div className="omr-warning-message" role="alert">{message}</div>}
          <div className="omr-actions">
            <button type="button" className="mock-secondary-button" onClick={resetCurrentAnswers}>답안 지우기</button>
            <button type="button" className="mock-confirm-button" onClick={saveCurrentAnswers}>답안 저장하기 <ArrowRight size={16} /></button>
          </div>
          <button type="button" className="omr-back-link" onClick={() => { setMessage(''); setView('subjects'); }}>← 과목 목록으로 돌아가기</button>
        </section>
      </div>
    );
  }

  if (view === 'subjects') {
    return (
      <div className="page-content subpage-content mock-page omr-page">
        <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> MOCK EXAM <ChevronRight size={14} /> 답안 입력 과목</div>
        <section className="mock-heading">
          <div>
            <span className="eyebrow">MOCK EXAM · GRADE 3</span>
            <h1>응시 과목 및 답안 입력</h1>
            <p>{selectedExamText} · 선택한 과목의 답안지를 각각 작성해 줘.</p>
          </div>
          <div className="mock-heading-icon"><FileText size={34} /></div>
        </section>

        <section className="mock-selection-panel">
          <div className="mock-section-title">
            <div className="mock-title-icon"><ListChecks size={19} /></div>
            <div>
              <span className="eyebrow">YOUR SUBJECTS</span>
              <h2>선택한 과목</h2>
              <p>국어·수학 선택과목과 탐구 선택을 확인해 줘.</p>
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
            <span>{savedCount} / {activeSubjects.length}과목 저장 완료</span>
          </div>
          <div className="mock-progress-track"><span style={{ width: `${(savedCount / activeSubjects.length) * 100}%` }} /></div>
          <div className="mock-answer-subject-list">
            {activeSubjects.map((item) => {
              const isSaved = Object.prototype.hasOwnProperty.call(savedAnswers, item.key);
              return (
                <div className={`mock-answer-subject-card ${isSaved ? 'saved' : ''}`} key={item.key}>
                  <div className="mock-answer-subject-info">
                    <span className="mock-answer-subject-category">{item.name === '국어' || item.name === '수학' ? '선택과목 포함' : item.name === '영어' || item.name === '한국사' ? '필수 영역' : `탐구 ${item.order}선택`}</span>
                    {item.key === 'korean' && getRegisteredAnswerKey(year, month, 'korean', koreanOption) && <span className="omr-grade-ready-label">정답표 등록 · 자동 채점 가능</span>}
                    <strong>{item.name}</strong>
                    <small>{item.detail} · {item.questionCount}문항</small>
                  </div>
                  <div className="mock-answer-subject-action">
                    {isSaved && <span className="mock-saved-label"><CheckCircle2 size={14} /> 저장 완료</span>}
                    <button type="button" className="mock-secondary-button" onClick={() => openAnswerSheet(item.key)}>{isSaved ? '답안 수정' : '답안 입력'}</button>
                  </div>
                </div>
              );
            })}
          </div>
          {savedCount === activeSubjects.length && (
            <div className="mock-all-saved-notice">
              <CheckCircle2 size={18} />
              <div><strong>선택한 과목의 답안 입력이 모두 끝났어!</strong><p>현재 등록된 2027학년도 9월 국어 정답표는 국어 답안을 저장하면 자동 채점돼. 나머지 과목은 해당 회차 정답표 등록 후 채점할 수 있어.</p></div>
            </div>
          )}
        </section>

        <div className="mock-confirm-panel">
          <div className="mock-confirm-copy">
            <span className="eyebrow">EXAM SETTINGS</span>
            <h2>시험 조건을 바꾸고 싶어?</h2>
            <p>학년도, 월 또는 선택과목을 다시 설정할 수 있어.</p>
          </div>
          <button type="button" className="mock-confirm-button" onClick={changeExamSelection}>시험 조건 수정하기 <ArrowRight size={17} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content subpage-content mock-page omr-page">
      <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> MOCK EXAM</div>

      <section className="mock-heading">
        <div>
          <span className="eyebrow">MOCK EXAM SERVICE · GRADE 3</span>
          <h1>고3 모의고사 풀서비스</h1>
          <p>학년도와 시행 월, 국어·수학 선택과목, 탐구 과목을 설정해 줘.</p>
        </div>
        <div className="mock-heading-icon"><FileText size={34} /></div>
      </section>

      <section className="mock-selection-panel">
        <div className="mock-section-title">
          <div className="mock-title-icon"><CalendarDays size={19} /></div>
          <div>
            <span className="eyebrow">STEP 01</span>
            <h2>시험 정보 선택</h2>
            <p>이 서비스는 고3 수험생 전용이야.</p>
          </div>
        </div>
        <div className="mock-grade-fixed"><GraduationCap size={18} /><span>응시 학년</span><strong>고3</strong><small>고3 전용 서비스</small></div>
        <div className="mock-select-grid">
          <label className="mock-field">
            <span>학년도</span>
            <select value={year} onChange={(event) => { setYear(event.target.value); clearSavedAnswers(); }}>
              {years.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="mock-field">
            <span>시험 월</span>
            <select value={month} onChange={(event) => { setMonth(event.target.value); clearSavedAnswers(); }}>
              {months.map((item) => <option key={item} value={item}>{item}{item === '11월' ? ' 수능' : ' 모의고사'}</option>)}
            </select>
          </label>
        </div>
        <p className="omr-subject-note">※ 실제 시행 월과 시험 종류는 학년도별로 다를 수 있어. 현재 선택 목록은 화면 구성 단계이며, 공식 문제·정답이 등록된 회차만 추후 채점할 수 있도록 연결할 예정이야.</p>
      </section>

      <section className="mock-selection-panel">
        <div className="mock-section-title">
          <div className="mock-title-icon"><BookOpenCheck size={19} /></div>
          <div>
            <span className="eyebrow">STEP 02</span>
            <h2>국어·수학 선택과목</h2>
            <p>각 영역에서 한 과목씩 선택해 줘.</p>
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
            <p>사회·과학탐구 17개 과목 중 최대 2개까지 자유롭게 선택해 줘.</p>
          </div>
        </div>
        <div className="mock-inquiry-counter"><strong>{selectedInquiries.length} / 2</strong><span>과목 선택</span><div className="mock-inquiry-counter-track"><i style={{ width: `${(selectedInquiries.length / 2) * 100}%` }} /></div></div>
        <div className="mock-inquiry-group">
          <div className="mock-inquiry-group-title"><strong>사회탐구</strong><span>9과목</span></div>
          <div className="mock-inquiry-grid">
            {socialStudies.map((item) => (
              <button type="button" key={item} aria-pressed={selectedInquiries.includes(item)} disabled={selectedInquiries.length >= 2 && !selectedInquiries.includes(item)} className={`mock-inquiry-chip ${selectedInquiries.includes(item) ? 'selected' : ''}`} onClick={() => handleInquiryToggle(item)}>
                {item}{selectedInquiries.includes(item) && <CheckCircle2 size={15} />}
              </button>
            ))}
          </div>
        </div>
        <div className="mock-inquiry-group">
          <div className="mock-inquiry-group-title"><strong>과학탐구</strong><span>8과목</span></div>
          <div className="mock-inquiry-grid">
            {scienceStudies.map((item) => (
              <button type="button" key={item} aria-pressed={selectedInquiries.includes(item)} disabled={selectedInquiries.length >= 2 && !selectedInquiries.includes(item)} className={`mock-inquiry-chip ${selectedInquiries.includes(item) ? 'selected' : ''}`} onClick={() => handleInquiryToggle(item)}>
                {item}{selectedInquiries.includes(item) && <CheckCircle2 size={15} />}
              </button>
            ))}
          </div>
        </div>
        <p className="omr-subject-note">사회탐구와 과학탐구를 섞어서 선택해도 돼. 예: 생활과 윤리 + 생명과학Ⅰ</p>
      </section>

      {message && <div className="omr-warning-message" role="alert">{message}</div>}
      <section className="mock-confirm-panel">
        <div className="mock-confirm-copy">
          <span className="eyebrow">MY SELECTED EXAM</span>
          <h2>선택한 시험 확인</h2>
          <p>{selectedExamText} · 국어 {koreanOption || '미선택'} · 수학 {mathOption || '미선택'} · 탐구 {selectedInquiries.length ? selectedInquiries.join(' / ') : '미선택'}</p>
        </div>
        <button type="button" className="mock-confirm-button" onClick={confirmExamSelection}>선택 완료 <ArrowRight size={17} /></button>
      </section>
    </div>
  );
}


const ARCADE_MENU_ITEMS = [
  {
    id: 'yeot',
    emoji: '🍬',
    title: '합격엿 붙이기',
    description: '길쭉한 엿이나 찹쌀떡을 목표 대학 교문에 던져봐!',
    status: '이용 가능',
    available: true,
    tone: 'peach',
  },
  {
    id: 'charm',
    emoji: '🧧',
    title: '나만의 합격 부적',
    description: '이름과 목표 대학을 담아 나만의 부적 만들기',
    status: '준비 중',
    available: false,
    tone: 'pink',
  },
  {
    id: 'fortune',
    emoji: '🔮',
    title: '오늘의 운세',
    description: '오늘의 공부운과 행운의 메시지 확인하기',
    status: '준비 중',
    available: false,
    tone: 'lavender',
  },
  {
    id: 'roulette',
    emoji: '🎯',
    title: '찍기 신 돌림판',
    description: '선택지를 돌려 오늘의 행운 번호 뽑기',
    status: '준비 중',
    available: false,
    tone: 'blue',
  },
  {
    id: 'letter',
    emoji: '💌',
    title: '미래의 나에게 편지',
    description: '지금의 마음을 미래의 나에게 남겨보기',
    status: '준비 중',
    available: false,
    tone: 'mint',
  },
  {
    id: 'break',
    emoji: '☁️',
    title: '5분 휴식 뽑기',
    description: '잠깐 쉬어갈 수 있는 작은 미션 뽑기',
    status: '준비 중',
    available: false,
    tone: 'cream',
  },
];

function ArcadePage({ universityName, onNavigate }) {
  const [selectedFeature, setSelectedFeature] = useState('menu');
  const hasUniversity = Boolean(String(universityName || '').trim());

  if (selectedFeature === 'yeot') {
    return (
      <div className="page-content subpage-content dc-arcade-game-page">
        <YeotGame
          universityName={universityName}
          onBack={() => setSelectedFeature('menu')}
        />
      </div>
    );
  }

  return (
    <div className="page-content subpage-content dc-arcade-page">
      <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> ARCADE</div>
      <section className="subpage-hero dc-arcade-hero">
        <div className="subpage-icon"><Gamepad2 size={30} /></div>
        <div>
          <span className="eyebrow">ARCADE &amp; CHEER UP</span>
          <h1>오락실 / 합격 응원</h1>
          <p>
            {hasUniversity
              ? `${universityName}을(를) 향한 너의 꿈을 응원해! 잠깐 쉬어가도 괜찮아.`
              : '공부하다 지칠 때, 잠깐 쉬어가며 작은 즐거움을 찾아봐!'}
          </p>
        </div>
      </section>

      <div className="dc-arcade-section-heading">
        <div>
          <span className="eyebrow">CHOOSE YOUR CONTENT</span>
          <h2>무엇을 해볼까?</h2>
        </div>
        <span className="dc-arcade-section-note">가볍게 즐기는 합격 응원 콘텐츠</span>
      </div>

      <section className="dc-arcade-card-grid" aria-label="오락실 세부 메뉴">
        {ARCADE_MENU_ITEMS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`dc-arcade-feature-card tone-${item.tone} ${item.available ? 'is-available' : 'is-coming'}`}
            onClick={() => item.available && setSelectedFeature(item.id)}
            disabled={!item.available}
            aria-label={`${item.title}${item.available ? ' 시작' : ', 준비 중'}`}
          >
            <span className="dc-arcade-card-topline">
              <span className="dc-arcade-emoji" aria-hidden="true">{item.emoji}</span>
              <span className={`dc-arcade-status ${item.available ? 'ready' : ''}`}>{item.status}</span>
            </span>
            <strong>{item.title}</strong>
            <span className="dc-arcade-card-description">{item.description}</span>
            <span className="dc-arcade-card-action">
              {item.available ? '게임 시작하기' : '추후 추가 예정'}
              {item.available && <ArrowRight size={15} />}
            </span>
          </button>
        ))}

        <button
          type="button"
          className="dc-arcade-feature-card tone-student is-available"
          onClick={() => onNavigate('mypage')}
        >
          <span className="dc-arcade-card-topline">
            <span className="dc-arcade-emoji" aria-hidden="true">🎓</span>
            <span className="dc-arcade-status ready">바로 보기</span>
          </span>
          <strong>미래 대학생 학생증</strong>
          <span className="dc-arcade-card-description">마이페이지에 등록한 나의 미래 학생증 확인하기</span>
          <span className="dc-arcade-card-action">학생증 확인하기 <ArrowRight size={15} /></span>
        </button>
      </section>

      <p className="dc-arcade-note">※ 오락실 콘텐츠는 공부와 입시 사이에 잠깐 즐기는 응원용 기능이야.</p>
    </div>
  );
}


function StudentIdCard({ profile }) {
  const theme = getUniversityTheme(profile.university || '');
  return (
    <div className="dc-student-card" style={{ '--dc-accent': theme.accent, '--dc-accent-soft': theme.soft }}>
      <div className="dc-student-card-top">
        <div className="dc-student-emblem"><GraduationCap size={25} /></div>
        <div className="dc-student-university">
          <strong>{profile.university || 'DREAM CAMPUS'}</strong>
          <span>{profile.university ? 'YOUR FUTURE UNIVERSITY' : 'YOUR FUTURE CAMPUS'}</span>
        </div>
        <span className="dc-student-label">FUTURE CARD</span>
      </div>
      <div className="dc-student-card-body">
        <div className="dc-student-photo">
          {profile.photo ? <img src={profile.photo} alt="학생증 프로필 사진" /> : <UserRound size={39} />}
        </div>
        <div className="dc-student-details">
          <span className="dc-student-overline">DREAM CAMPUS MEMBER</span>
          <h3>{profile.name.trim() || '이름을 입력해 주세요'}</h3>
          <p>{profile.major || '희망 학과 미설정'}</p>
          <strong>{profile.admissionYear || '2027'}학번</strong>
        </div>
      </div>
      <div className="dc-student-card-bottom">
        <span>FUTURE STUDENT EXPERIENCE</span>
        <strong>{profile.memberCode || 'DC-MEMBER'}</strong>
      </div>
      <div className="dc-student-disclaimer">학교에서 발급한 공식 학생증이 아닌 DREAM CAMPUS 체험용 카드</div>
    </div>
  );
}

function MyPage({ profile, onProfileChange }) {
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

function PlaceholderPage({ pageId, onBack }) {
  const info = pageInfo[pageId] ?? pageInfo.mypage;
  const Icon = info.icon;
  return (
    <div className="page-content subpage-content">
      <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> {info.title}</div>
      <section className="subpage-hero">
        <div className="subpage-icon"><Icon size={30} /></div>
        <div><span className="eyebrow">{info.eyebrow}</span><h1>{info.title}</h1><p>{info.description}</p></div>
      </section>
      <section className="panel coming-panel">
        <div className="coming-symbol"><Settings2 size={25} /></div>
        <span className="coming-label">PAGE PREVIEW</span>
        <h2>이 페이지를 준비하고 있어요!</h2>
        <p>현재는 전체 사이트의 기본 틀을 만드는 단계예요.<br />아래 기능들을 순서대로 연결할 예정이에요.</p>
        <div className="feature-preview-grid">
          {info.features.map((feature, index) => (
            <div className="feature-preview" key={feature}><CheckCircle2 size={17} /><span>{feature}</span><small>0{index + 1}</small></div>
          ))}
        </div>
        <button className="primary-button dark-button" onClick={onBack}>메인 화면으로 돌아가기 <ArrowRight size={16} /></button>
      </section>
    </div>
  );
}

export default App;
