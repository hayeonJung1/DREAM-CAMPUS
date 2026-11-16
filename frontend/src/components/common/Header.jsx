import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Bell, ChevronLeft, Menu, Search, UserRound, X } from 'lucide-react';

/** DREAM CAMPUS 상단 헤더 및 메뉴 검색 */
export default function Header({ navItems, activePage, navigate, profile, onOpenMobileNav }) {
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const matchedMenus = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return [];
    return navItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [searchText, navItems]);

  const handleNavigate = (id) => {
    navigate(id);
    setShowSearch(false);
    setSearchText('');
  };

  return (
    <header className="topbar">
      <button className="mobile-menu-button icon-button" onClick={onOpenMobileNav} aria-label="메뉴 열기">
        <Menu size={20} />
      </button>
      {activePage !== 'home' && (
        <button className="app-home-back-button icon-button" onClick={() => handleNavigate('home')} aria-label="메인 화면으로 돌아가기" title="메인 화면으로">
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
            if (event.key === 'Enter' && matchedMenus[0]) handleNavigate(matchedMenus[0].id);
            if (event.key === 'Escape') setShowSearch(false);
          }}
          placeholder="원하는 메뉴를 검색해 보세요"
          aria-label="메뉴 검색"
        />
        {searchText && <button className="clear-search" onClick={() => setSearchText('')} aria-label="검색어 지우기"><X size={15} /></button>}
        {showSearch && searchText.trim() && (
          <div className="search-results">
            {matchedMenus.length ? matchedMenus.map((item) => (
              <button key={item.id} onClick={() => handleNavigate(item.id)}>{item.label}<ArrowUpRight size={15} /></button>
            )) : <span>검색 결과가 없어요.</span>}
          </div>
        )}
      </div>
      <div className="topbar-right">
        <span className="topbar-date">나의 입시·학습 관리</span>
        <button className="icon-button notification-button" aria-label="알림"><Bell size={19} /><i /></button>
        <button className="profile-button" onClick={() => handleNavigate('mypage')} aria-label="마이페이지">
          {profile?.photo ? <img src={profile.photo} alt="프로필" /> : <UserRound size={19} />}
        </button>
      </div>
    </header>
  );
}
