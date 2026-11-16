import React, { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Bell, BookOpenCheck, CalendarDays, TrendingUp,
  CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileText, Gamepad2,
  GraduationCap, Headphones, House, Landmark, ListChecks, Menu, Music2,
  Pencil, Plus, Trash2, Search, Settings2, Sparkles, Target, Trophy,
  UserRound, X,
} from 'lucide-react';
import { getLocalDateKey, getDdayInfo, getDateLabel, getUpcomingAdmissionEvents, getEventCategoryClass, getCalendarGridDays, CALENDAR_WEEKDAYS, isValidDateKey, ADMISSION_EVENT_CATEGORIES, sortAdmissionEvents, getUniversityTheme, resizeImageFile } from '../../utils/appUtils.js';

export default function StudentIdCard({ profile }) {
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
