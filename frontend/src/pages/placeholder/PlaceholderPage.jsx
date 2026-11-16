import React, { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Bell, BookOpenCheck, CalendarDays, TrendingUp,
  CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileText, Gamepad2,
  GraduationCap, Headphones, House, Landmark, ListChecks, Menu, Music2,
  Pencil, Plus, Trash2, Search, Settings2, Sparkles, Target, Trophy,
  UserRound, X,
} from 'lucide-react';

export default function PlaceholderPage({ info, onBack }) {
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
