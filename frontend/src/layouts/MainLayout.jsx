import React, { useState } from 'react';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';

/** 로그인 후 공통 화면 레이아웃: 사이드바, 상단바, 페이지 콘텐츠 */
export default function MainLayout({ navItems, activePage, navigate, profile, children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigate = (id) => {
    navigate(id);
    setMobileNavOpen(false);
  };

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {mobileNavOpen && <button className="mobile-backdrop" aria-label="메뉴 닫기" onClick={() => setMobileNavOpen(false)} />}
      <Sidebar
        navItems={navItems}
        activePage={activePage}
        navigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((previous) => !previous)}
        mobileOpen={mobileNavOpen}
      />
      <main className="main-area">
        <Header
          navItems={navItems}
          activePage={activePage}
          navigate={handleNavigate}
          profile={profile}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        {children}
      </main>
    </div>
  );
}
