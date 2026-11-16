import React, { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Bell, BookOpenCheck, CalendarDays, TrendingUp,
  CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileText, Gamepad2,
  GraduationCap, Headphones, House, Landmark, ListChecks, Menu, Music2,
  Pencil, Plus, Trash2, Search, Settings2, Sparkles, Target, Trophy,
  UserRound, X,
} from 'lucide-react';
import { getLocalDateKey, getDdayInfo, getDateLabel, getUpcomingAdmissionEvents, getEventCategoryClass, getCalendarGridDays, CALENDAR_WEEKDAYS, isValidDateKey, ADMISSION_EVENT_CATEGORIES, sortAdmissionEvents, getUniversityTheme, resizeImageFile } from '../utils/appUtils.js';
import MiniAdmissionCalendar from '../components/dashboard/MiniAdmissionCalendar.jsx';

export default function HomePage({ onNavigate, onOpenCalendar, profile, dailyGoals, onAddGoal, onToggleGoal, onRemoveGoal, admissionEvents, quickMenus }) {
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
