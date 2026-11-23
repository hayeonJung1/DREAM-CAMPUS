import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Heart,
  Headphones,
  ListMusic,
  Music2,
  Play,
  Search,
  Zap,
} from 'lucide-react';
import './PlaylistPage.css';


const categories = [
  
{
  id: 'exciting',
  title: '신나는 음악',
  description: '기분 전환이 필요할 때',
  image: '/images/playlist/exciting-mode.png',
  icon: Zap,
  playlists: [
    { title: '신나는 K-POP', description: '에너지를 충전하는 케이팝', searchTerm: '신나는 KPOP 플레이리스트' },
    { title: '청량한 아이돌 음악', description: '기분 좋아지는 청량한 노래', searchTerm: '청량한 KPOP 플레이리스트' },
    { title: '신나는 댄스곡', description: '리듬감 있는 댄스 음악', searchTerm: '신나는 댄스곡 모음' },
    { title: '밴드 · 록 음악', description: '시원하고 힘찬 밴드 사운드', searchTerm: '신나는 밴드 록 음악 플레이리스트' },
    { title: '시험 끝나고 듣는 노래', description: '드디어 끝났다! 해방감 가득한 음악', searchTerm: '시험 끝나고 듣는 신나는 노래' },
    { title: '추억의 K-POP', description: '다시 듣고 싶은 인기 가요', searchTerm: '추억의 KPOP 플레이리스트' },
    { title: '신나는 팝송', description: '기분을 밝게 만들어 주는 팝 음악', searchTerm: '신나는 팝송 모음' },
    { title: '에너지 충전 플레이리스트', description: '다시 공부할 힘을 얻고 싶을 때', searchTerm: '에너지 충전 신나는 노래 모음' },
  ],
},

  {
    id: 'exciting',
    title: '신나는 음악',
    description: '기분 전환이 필요할 때',
    image: '/images/playlist/exciting-mode.png',
    icon: Zap,
    playlists: [
      { title: '신나는 K-POP', description: '에너지를 충전하는 케이팝', searchTerm: '신나는 KPOP 플레이리스트' },
      { title: '국내 댄스 음악', description: '리듬감 있는 댄스 음악', searchTerm: '신나는 국내 댄스 음악 모음' },
      { title: '밴드 · 록 음악', description: '시원한 밴드 사운드', searchTerm: '신나는 밴드 록 음악 플레이리스트' },
      { title: '운동할 때 듣는 음악', description: '운동 의욕을 높여주는 노래', searchTerm: '운동할 때 듣는 신나는 음악' },
      { title: '드라이브 플레이리스트', description: '달리면서 듣기 좋은 음악', searchTerm: '드라이브 신나는 노래 플레이리스트' },
      { title: '2000년대 추억의 K-POP', description: '추억의 인기 가요', searchTerm: '2000년대 추억의 KPOP 모음' },
      { title: '신나는 팝송', description: '기분 좋은 해외 팝 음악', searchTerm: '신나는 팝송 플레이리스트' },
      { title: '기분 전환 플레이리스트', description: '우울한 기분을 바꾸고 싶을 때', searchTerm: '기분 전환 신나는 노래 모음' },
    ],
  },
  {
    id: 'ost',
    title: 'OST · 연주곡',
    description: '음악 자체에 집중하고 싶을 때',
    image: '/images/playlist/ost-mode.png',
    icon: Music2,
    playlists: [
      { title: '영화 OST 모음', description: '영화 속 아름다운 선율', searchTerm: '영화 OST 모음 플레이리스트' },
      { title: '드라마 OST 모음', description: '드라마 속 감성적인 음악', searchTerm: '드라마 OST 모음 플레이리스트' },
      { title: '애니메이션 OST', description: '애니메이션 명곡 모음', searchTerm: '애니메이션 OST 플레이리스트' },
      { title: '게임 OST · BGM', description: '게임 속 몰입감 있는 음악', searchTerm: '게임 OST BGM 모음' },
      { title: '피아노로 듣는 OST', description: '좋아하는 OST의 피아노 연주', searchTerm: 'OST 피아노 연주곡 모음' },
      { title: '웅장한 오케스트라', description: '웅장하고 아름다운 연주곡', searchTerm: '웅장한 오케스트라 음악 모음' },
      { title: '디즈니 OST', description: '디즈니 명곡 모음', searchTerm: '디즈니 OST 플레이리스트' },
      { title: '가사 없는 감성 연주곡', description: '선율에 집중하는 연주 음악', searchTerm: '가사 없는 감성 연주곡 모음' },
    ],
  },
  {
    id: 'healing',
    title: '힐링 · 응원',
    description: '위로와 응원이 필요할 때',
    image: '/images/playlist/healing-mode.png',
    icon: Heart,
    playlists: [
      { title: '수능을 바라보고 있는 너에게', description: '위로와 응원을 담은 노래 모음', searchTerm: '수능을 바라보고 있는 너에게 위로와 응원을 담은 노래 모음' },
      { title: '지칠 때 듣는 위로 음악', description: '마음을 편안하게 해주는 노래', searchTerm: '지칠 때 듣는 위로 노래 플레이리스트' },
      { title: '잔잔한 인디 · 팝', description: '편안하게 즐기는 감성 음악', searchTerm: '잔잔한 인디 팝 플레이리스트' },
      { title: '어쿠스틱 감성 음악', description: '따뜻한 기타와 목소리', searchTerm: '어쿠스틱 감성 음악 플레이리스트' },
      { title: '새벽 감성 플레이리스트', description: '조용한 밤에 어울리는 음악', searchTerm: '새벽 감성 노래 모음' },
      { title: '마음이 편안해지는 노래', description: '복잡한 마음을 쉬게 하는 음악', searchTerm: '마음이 편안해지는 힐링 음악' },
      { title: '힘이 되는 가사의 노래', description: '다시 나아갈 용기를 주는 음악', searchTerm: '힘이 되는 가사 응원 노래 모음' },
      { title: '추억의 감성 발라드', description: '오래 기억하고 싶은 노래', searchTerm: '추억의 감성 발라드 플레이리스트' },
    ],
  },
];


function openYouTubeSearch(keyword) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}


export default function PlaylistPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const state = window.history.state || {};

    return state.dreamCampusPage === 'playlist'
      ? state.dreamCampusPlaylistCategory || null
      : null;
  });

  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state || {};

      if (state.dreamCampusPage === 'playlist') {
        setSelectedCategory(
          state.dreamCampusPlaylistCategory || null
        );
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const openCategory = (categoryId) => {
    window.history.pushState(
      {
        ...(window.history.state || {}),
        dreamCampusPage: 'playlist',
        dreamCampusPlaylistCategory: categoryId,
      },
      '',
      window.location.href
    );

    setSelectedCategory(categoryId);
  };

  const returnToCategories = () => {
    window.history.back();
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchKeyword.trim()) return;

    openYouTubeSearch(searchKeyword.trim());
  };

  if (selectedCategory) {
    const category = categories.find(
      (item) => item.id === selectedCategory
    );

    if (!category) {
      return null;
    }

    const CategoryIcon = category.icon;

    return (
      <div className="page-content playlist-page">
        <button
          className="playlist-back-button"
          onClick={returnToCategories}
        >
          <ArrowLeft size={17} />
          
        </button>

        <section className="playlist-category-detail">
          <div className="playlist-detail-image">
            <img
              src={category.image}
              alt={category.title}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />

            <div className="playlist-detail-overlay">
              <CategoryIcon size={30} />
              <div>
                <h1>{category.title}</h1>
                <p>{category.description}</p>
              </div>
            </div>
          </div>

          <div className="playlist-section-heading">
            <ListMusic size={20} />
            <h2>재생목록</h2>
            <span>{category.playlists.length}개의 목록</span>
          </div>

          <div className="playlist-list">
            {category.playlists.map((playlist, index) => (
              <button
                className="playlist-list-item"
                key={playlist.title}
                onClick={() => openYouTubeSearch(playlist.searchTerm)}
              >
                <div className="playlist-number">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="playlist-item-icon">
                  <Headphones size={21} />
                </div>

                <div className="playlist-item-copy">
                  <strong>{playlist.title}</strong>
                  <span>{playlist.description}</span>
                </div>

                <div className="playlist-open-icon">
                  <ArrowUpRight size={19} />
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-content playlist-page">
      <section className="playlist-main-hero">
        <div className="playlist-hero-copy">
          <span className="playlist-eyebrow">DREAM-CAMPUS MUSIC</span>
          <h1>나만의 음악과 함께하는 시간</h1>
          <p>공부할 때도, 쉬어갈 때도 원하는 음악을 찾아보세요.</p>
        </div>

        <div className="playlist-hero-icon">
          <Headphones size={54} />
          <Music2 size={24} />
        </div>
      </section>

      <section className="playlist-search-section">
        <form className="playlist-search-form" onSubmit={handleSearch}>
          <Search size={21} />

          <input
            type="text"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            placeholder="원하는 음악을 검색해보세요!"
          />

          <button type="submit">유튜브 검색</button>
        </form>

        <p>검색하면 YouTube에서 다양한 음악 영상을 확인할 수 있어요.</p>
      </section>

      <section className="playlist-category-section">
        <div className="playlist-section-heading">
          <Music2 size={21} />
          <h2>음악 카테고리</h2>
          <span>원하는 분야를 선택해 보세요.</span>
        </div>

        <div className="playlist-category-grid">
          {categories.map((category) => {
            const CategoryIcon = category.icon;

            return (
              <button
                className={`playlist-category-card playlist-category-${category.id}`}
                key={category.id}
                onClick={() => openCategory(category.id)}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />

                <div className="playlist-category-overlay">
                  <CategoryIcon size={29} />
                  <strong>{category.title}</strong>
                  <span>{category.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
