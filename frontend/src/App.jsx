import React, { useEffect, useState } from 'react';
import {
  CalendarDays, Clock3, FileText, Gamepad2, GraduationCap, Headphones, House, Landmark,
  Music2, UserRound,
} from 'lucide-react';
import HomePage from './pages/Home/HomePage.jsx';
import AuthPage from './pages/auth/AuthPage.jsx';
import MockExamPage from './pages/exam/MockExamPage.jsx';
import MyPage from './pages/mypage/MyPage.jsx';
import AdmissionCalendarPage from './pages/calendar/CalendarPage.jsx';
import ArcadePage from './pages/arcade/ArcadePage.jsx';
import PlaceholderPage from './pages/placeholder/PlaceholderPage.jsx';
import PlaylistPage from './pages/playlist/PlaylistPage.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import { createDefaultProfile, normalizeProfile, usePersistentState, getLocalDateKey, createInitialAdmissionEvents, normalizeAdmissionEvents } from './utils/appUtils.js';
import StudyPage  from './pages/study/StudyPage.jsx'

const navItems = [
  { id: 'home', label: '홈', icon: House },
  { id: 'mock', label: '모의고사 풀서비스', icon: FileText },
  { id: 'timer', label: '공부 타이머', icon: Clock3 },
  { id: 'campus', label: '대학교 및 학과 정보', icon: Landmark },
  { id: 'admission', label: '캘린더', icon: CalendarDays },
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
    title: '캘린더',
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
    title: '캘린더',
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
  const [activePage, setActivePage] = useState(() => {
  const savedPage = window.history.state?.dreamCampusPage;

  return navItems.some((item) => item.id === savedPage)
    ? savedPage
    : 'home';
});
 const [authUser, setAuthUser] = useState(null);

const [authMode, setAuthMode] = useState(() => {
  const state = window.history.state || {};

  return state.dreamCampusAuth
    ? state.dreamCampusAuthMode || 'login'
    : null;
});

const [authLoading, setAuthLoading] = useState(true);

useEffect(() => {
  let isActive = true;

  fetch('/api/auth/me', {
    credentials: 'same-origin',
  })
    .then(async (response) => {
      if (response.status === 401) return null;

      const result = await response.json();

      if (!response.ok || !result.success) return null;

      return result.data;
    })
    .then((user) => {
      if (isActive) {
        setAuthUser(user);
        setAuthLoading(false);
      }
    })
    .catch(() => {
      if (isActive) {
        setAuthUser(null);
        setAuthLoading(false);
      }
    });

  return () => {
    isActive = false;
  };
}, []);


  const [profile, setProfile] = usePersistentState('dream-campus-profile', createDefaultProfile, normalizeProfile);
  const [admissionEvents, setAdmissionEvents] = usePersistentState(
    'dream-campus-admission-events', createInitialAdmissionEvents, normalizeAdmissionEvents,
  );
  const [calendarFocusDate, setCalendarFocusDate] = useState(getLocalDateKey());
  const [goalsByDate, setGoalsByDate] = usePersistentState('dream-campus-daily-goals', () => ({}));
  const todayKey = getLocalDateKey();
  const dailyGoals = Array.isArray(goalsByDate[todayKey]) ? goalsByDate[todayKey] : [];


useEffect(() => {
  const currentState = window.history.state || {};
  const validPage = navItems.some(
    (item) => item.id === currentState.dreamCampusPage
  );

  if (!validPage) {
    window.history.replaceState(
      {
        ...currentState,
        dreamCampusPage: 'home',
        dreamCampusAppEntry: true,
      },
      '',
      window.location.href
    );
  }

  const handlePopState = (event) => {
    const state = event.state || {};
    const requestedPage = state.dreamCampusPage;

    const isValidPage = navItems.some(
      (item) => item.id === requestedPage
    );

    setActivePage(isValidPage ? requestedPage : 'home');

    setAuthMode(
      state.dreamCampusAuth
        ? state.dreamCampusAuthMode || 'login'
        : null
    );
  };

  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, []);

const navigate = (id) => {
  const nextPage = navItems.some((item) => item.id === id)
    ? id
    : 'home';

  if (nextPage === activePage && !authMode) return;

  const nextState = {
    ...(window.history.state || {}),
    dreamCampusPage: nextPage,
    dreamCampusAppEntry: true,
    dreamCampusPlaylistCategory: null,
    dreamCampusPlaylistSection: null,
    dreamCampusArcadeFeature: null,
  };

  window.history.pushState(
    nextState,
    '',
    window.location.href
  );

  setActivePage(nextPage);
  setAuthMode(null);
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

  const openAuth = (mode = 'login') => {
  const nextMode = mode === 'register' ? 'register' : 'login';

  window.history.pushState(
    {
      ...(window.history.state || {}),
      dreamCampusPage: activePage,
      dreamCampusAuth: true,
      dreamCampusAuthMode: nextMode,
      dreamCampusAuthDepth: 1,
    },
    '',
    window.location.href
  );

  setAuthMode(nextMode);
};

const closeAuth = () => {
  const state = window.history.state || {};

  if (state.dreamCampusAuth) {
    const depth = Math.max(
      1,
      Number(state.dreamCampusAuthDepth) || 1
    );

    window.history.go(-depth);
  } else {
    setAuthMode(null);
  }
};

  const handleLogout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });

    if (!response.ok) {
      throw new Error('로그아웃에 실패했습니다.');
    }

    setAuthUser(null);
  } catch (error) {
    alert(error.message || '로그아웃 중 오류가 발생했습니다.');
  }
};

if (authMode) {
  return (
    <AuthPage
      initialMode={authMode}
   onCancel={closeAuth}
onLogin={(user) => {
  setAuthUser(user);
  closeAuth();
}}
    />
  );
}

   return (
    <MainLayout
  navItems={navItems}
  activePage={activePage}
  navigate={navigate}
  profile={profile}
  authUser={authUser}
 onOpenAuth={openAuth}
  onLogout={handleLogout}
>
      {activePage === 'home' ? (
        <HomePage
          quickMenus={quickMenus}
          onNavigate={navigate}
          onOpenCalendar={(dateKey) => {
            setCalendarFocusDate(dateKey || getLocalDateKey());
            navigate('admission');
          }}
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
        <AdmissionCalendarPage
          events={admissionEvents}
          onEventsChange={setAdmissionEvents}
          initialDate={calendarFocusDate}
        />
        ) : activePage === 'arcade' ? (
  <ArcadePage
    universityName={profile.university}
    onNavigate={navigate}
  />

      ) : activePage === 'timer' ? (
  <StudyPage />
) : activePage === 'playlist' ? (
  <PlaylistPage />
) : (
  <PlaceholderPage
    info={pageInfo[activePage] ?? pageInfo.mypage}
    onBack={() => navigate('home')}
  />
)}
    </MainLayout>
  );
}

export default App;