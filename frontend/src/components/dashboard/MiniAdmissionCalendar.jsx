import React, { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Bell, BookOpenCheck, CalendarDays, TrendingUp,
  CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileText, Gamepad2,
  GraduationCap, Headphones, House, Landmark, ListChecks, Menu, Music2,
  Pencil, Plus, Trash2, Search, Settings2, Sparkles, Target, Trophy,
  UserRound, X,
} from 'lucide-react';
import { getLocalDateKey, getDdayInfo, getDateLabel, getUpcomingAdmissionEvents, getEventCategoryClass, getCalendarGridDays, CALENDAR_WEEKDAYS, isValidDateKey, ADMISSION_EVENT_CATEGORIES, sortAdmissionEvents, getUniversityTheme, resizeImageFile } from '../../utils/appUtils.js';

export default function MiniAdmissionCalendar({ events, onOpenCalendar }) {
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
        <div><span className="dc-calendar-heading-icon"><CalendarDays size={18} /></span><div><span className="eyebrow">ADMISSION SCHEDULE</span><h3>캘린더</h3></div></div>
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
