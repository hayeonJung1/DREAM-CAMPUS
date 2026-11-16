import React from 'react';
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';

/** DREAM CAMPUS 왼쪽 메뉴 */
export default function Sidebar({ navItems, activePage, navigate, collapsed, onToggleCollapsed, mobileOpen }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
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
        onClick={onToggleCollapsed}
        aria-label={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
        aria-expanded={!collapsed}
        title={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
              title={collapsed ? item.label : undefined}
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
  );
}
