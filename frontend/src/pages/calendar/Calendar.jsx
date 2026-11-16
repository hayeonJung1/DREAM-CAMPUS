import React, { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Bell, BookOpenCheck, CalendarDays, TrendingUp,
  CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileText, Gamepad2,
  GraduationCap, Headphones, House, Landmark, ListChecks, Menu, Music2,
  Pencil, Plus, Trash2, Search, Settings2, Sparkles, Target, Trophy,
  UserRound, X,
} from 'lucide-react';
import { getLocalDateKey, getDdayInfo, getDateLabel, getUpcomingAdmissionEvents, getEventCategoryClass, getCalendarGridDays, CALENDAR_WEEKDAYS, isValidDateKey, ADMISSION_EVENT_CATEGORIES, sortAdmissionEvents, getUniversityTheme, resizeImageFile } from '../../utils/appUtils.js';

export default function AdmissionCalendarPage({ events, onEventsChange, initialDate }) {
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
