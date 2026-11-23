import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Heart,
  Headphones,
  ListMusic,
  Music2,
  Pencil,
  Search,
  Trash2,
  Zap,
} from 'lucide-react';
import './PlaylistPage.css';

const FAVORITES_STORAGE_KEY = 'dream-campus-playlist-favorites';
function readSavedFavorites() {
  try {
    const saved = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const CUSTOM_PLAYLISTS_STORAGE_KEY = 'dream-campus-custom-playlists-v1';

function readSavedCustomPlaylists() {
  try {
    const saved = window.localStorage.getItem(CUSTOM_PLAYLISTS_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (playlist) =>
        playlist &&
        typeof playlist.id === 'string' &&
        typeof playlist.name === 'string' &&
        Array.isArray(playlist.items)
    );
  } catch {
    return [];
  }
}



const categories = [

{
  id: 'focus',
  title: '집중 모드',
  description: '공부에 집중하고 싶을 때',
  image: '/images/playlist/focus-mode.png',
  icon: BookOpen,
  playlists: [
    {
      title: '피아노 집중곡',
      description: '차분한 피아노 연주곡',
      searchTerm: '공부할 때 듣는 잔잔한 피아노 플레이리스트',
    },
    {
      title: '공부할 때 듣는 클래식',
      description: '집중을 위한 클래식 음악',
      searchTerm: '공부할 때 듣는 클래식 음악',
    },
    {
      title: '로파이 음악 모음',
      description: '편안한 비트의 로파이',
      searchTerm: '공부 집중 lofi playlist',
    },
    {
      title: '공부 집중 음악',
      description: '공부에 몰입하고 싶을 때',
      searchTerm: 'study focus music playlist',
    },
    {
      title: '잔잔한 앰비언트',
      description: '방해받지 않는 분위기의 음악',
      searchTerm: 'study ambient music',
    },
    {
      title: '빗소리 · 백색소음',
      description: '빗소리와 자연의 소리',
      searchTerm: '공부할 때 듣는 빗소리 백색소음',
    },
    {
      title: '카페 공부 음악',
      description: '카페에서 공부하는 듯한 분위기',
      searchTerm: '카페 공부 음악 플레이리스트',
    },
    {
      title: '브라운 노이즈',
      description: '일정한 배경 소음으로 집중하기',
      searchTerm: 'brown noise study',
    },
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

  const [selectedMyMusic, setSelectedMyMusic] = useState(() => {
    const state = window.history.state || {};
    return state.dreamCampusPage === 'playlist'
      ? state.dreamCampusPlaylistSection || null
      : null;
  });

  const [favorites, setFavorites] = useState(readSavedFavorites);
  const [customPlaylists, setCustomPlaylists] = useState(
  readSavedCustomPlaylists
);
const [favoritePlaylistTargets, setFavoritePlaylistTargets] = useState({});

const [selectedCustomPlaylistId, setSelectedCustomPlaylistId] = useState(() => {
  const state = window.history.state || {};

  return state.dreamCampusPage === 'playlist'
    ? state.dreamCampusCustomPlaylistId || null
    : null;
});

const [newPlaylistName, setNewPlaylistName] = useState('');
const [newMusicTitle, setNewMusicTitle] = useState('');
const [newMusicUrl, setNewMusicUrl] = useState('');

useEffect(() => {
  try {
    window.localStorage.setItem(
      CUSTOM_PLAYLISTS_STORAGE_KEY,
      JSON.stringify(customPlaylists)
    );
  } catch (error) {
    console.warn('나만의 플레이리스트를 저장하지 못했어요.', error);
  }
}, [customPlaylists]);

useEffect(() => {
  try {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites)
    );
  } catch (error) {
    console.warn('찜한 음악을 저장하지 못했어요.', error);
  }
}, [favorites]);

const isFavorite = (categoryId, title) => {
  return favorites.some(
    (item) => item.id === `${categoryId}-${title}`
  );
};

const toggleFavorite = (playlist, category) => {
  const favoriteId = `${category.id}-${playlist.title}`;

  setFavorites((previous) => {
    const exists = previous.some(
      (item) => item.id === favoriteId
    );

    if (exists) {
      return previous.filter((item) => item.id !== favoriteId);
    }

    return [
      ...previous,
      {
        id: favoriteId,
        categoryId: category.id,
        categoryTitle: category.title,
        title: playlist.title,
        description: playlist.description,
        searchTerm: playlist.searchTerm,
        image: category.image,
      },
    ];
  });
};

const addFavoriteToCustomPlaylist = (favorite, playlistId) => {
  if (!playlistId) return;

  const targetPlaylist = customPlaylists.find(
    (playlist) => playlist.id === playlistId
  );

  if (!targetPlaylist) return;

  const alreadyAdded = targetPlaylist.items.some(
    (item) => item.favoriteId === favorite.id
  );

  if (alreadyAdded) {
    window.alert('이미 이 플레이리스트에 추가된 음악이에요.');
    return;
  }

  const newMusic = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    favoriteId: favorite.id,
    title: favorite.title,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(favorite.searchTerm)}`,
  };

  setCustomPlaylists((previous) =>
    previous.map((playlist) =>
      playlist.id === playlistId
        ? { ...playlist, items: [...playlist.items, newMusic] }
        : playlist
    )
  );

  window.alert('나만의 플리에 음악을 추가했어요!');
};

useEffect(() => {
  const handlePopState = (event) => {
    const state = event.state || {};

    if (state.dreamCampusPage === 'playlist') {
      setSelectedCategory(state.dreamCampusPlaylistCategory || null);
      setSelectedMyMusic(state.dreamCampusPlaylistSection || null);
      setSelectedCustomPlaylistId(state.dreamCampusCustomPlaylistId || null);
    } else {
      setSelectedCategory(null);
      setSelectedMyMusic(null);
      setSelectedCustomPlaylistId(null);
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
      dreamCampusPlaylistSection: null,
      dreamCampusCustomPlaylistId: null,
    },
    '',
    window.location.href
  );

  setSelectedCategory(categoryId);
  setSelectedMyMusic(null);
  setSelectedCustomPlaylistId(null);
};

const openMyMusic = (section) => {
  window.history.pushState(
    {
      ...(window.history.state || {}),
      dreamCampusPage: 'playlist',
      dreamCampusPlaylistCategory: null,
      dreamCampusPlaylistSection: section,
      dreamCampusCustomPlaylistId: null,
    },
    '',
    window.location.href
  );

  setSelectedCategory(null);
  setSelectedMyMusic(section);
  setSelectedCustomPlaylistId(null);
};

const openCustomPlaylist = (playlistId) => {
  window.history.pushState(
    {
      ...(window.history.state || {}),
      dreamCampusPage: 'playlist',
      dreamCampusPlaylistCategory: null,
      dreamCampusPlaylistSection: 'custom',
      dreamCampusCustomPlaylistId: playlistId,
    },
    '',
    window.location.href
  );

  setSelectedCategory(null);
  setSelectedMyMusic('custom');
  setSelectedCustomPlaylistId(playlistId);
};

  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchKeyword.trim()) return;

    openYouTubeSearch(searchKeyword.trim());
  };

  const createCustomPlaylist = () => {
  const name = newPlaylistName.trim();

  if (!name) return;

  const newPlaylist = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    items: [],
    createdAt: new Date().toISOString(),
  };

  setCustomPlaylists((previous) => [
    ...previous,
    newPlaylist,
  ]);

  setNewPlaylistName('');
};

const renameCustomPlaylist = (playlist) => {
  const nextName = window.prompt(
    '새 플레이리스트 이름을 입력해 주세요.',
    playlist.name
  );

  if (nextName === null) return;

  const name = nextName.trim();

  if (!name) {
    window.alert('플레이리스트 이름을 입력해 주세요.');
    return;
  }

  setCustomPlaylists((previous) =>
    previous.map((item) =>
      item.id === playlist.id
        ? { ...item, name }
        : item
    )
  );
};

const deleteCustomPlaylist = (playlistId) => {
  const target = customPlaylists.find(
    (item) => item.id === playlistId
  );

  if (!target) return;

  const confirmed = window.confirm(
    `"${target.name}" 플레이리스트를 삭제할까요? 안에 있는 음악도 함께 삭제돼요.`
  );

  if (!confirmed) return;

  setCustomPlaylists((previous) =>
    previous.filter((item) => item.id !== playlistId)
  );
};

const addMusicToCustomPlaylist = (event) => {
  event.preventDefault();

  const title = newMusicTitle.trim();
  const rawUrl = newMusicUrl.trim();

  if (!title || !rawUrl || !selectedCustomPlaylistId) return;

  let parsedUrl;

  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    alert('올바른 유튜브 주소를 입력해 주세요.');
    return;
  }

  const allowedHosts = [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'youtu.be',
  ];

  if (!allowedHosts.includes(parsedUrl.hostname.toLowerCase())) {
    alert('유튜브 영상 또는 재생목록 주소만 등록할 수 있어요.');
    return;
  }

  setCustomPlaylists((previous) =>
    previous.map((playlist) =>
      playlist.id === selectedCustomPlaylistId
        ? {
            ...playlist,
            items: [
              ...playlist.items,
              {
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                title,
                url: parsedUrl.href,
              },
            ],
          }
        : playlist
    )
  );

  setNewMusicTitle('');
  setNewMusicUrl('');
};

if (selectedCategory) {
  const category = categories.find((item) => item.id === selectedCategory);

  if (!category) return null;

  const CategoryIcon = category.icon;

  return (
    <div className="page-content playlist-page">
      <section className="playlist-category-detail">
        <button
          type="button"
          className="playlist-back-button"
          onClick={() => window.history.back()}
        >
          ← 뒤로가기
        </button>

        <div className="playlist-detail-image">
          <img
            src={category.image}
            alt={category.title}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <div className="playlist-detail-overlay">
            <CategoryIcon size={32} />
            <div>
              <h1>{category.title}</h1>
              <p>{category.description}</p>
            </div>
          </div>
        </div>

        <div className="playlist-section-heading">
          <Headphones size={20} />
          <h2>플레이리스트</h2>
          <span>{category.playlists.length}개</span>
        </div>

        <div className="playlist-list">
          {category.playlists.map((playlist, index) => (
            <div className="playlist-list-item-wrap" key={playlist.title}>
              <button
                type="button"
                className="playlist-list-item"
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

              <button
                type="button"
                className={`playlist-favorite-button ${
                  isFavorite(category.id, playlist.title) ? 'is-active' : ''
                }`}
                onClick={() => toggleFavorite(playlist, category)}
                aria-label="찜하기"
              >
                <Heart
                  size={20}
                  fill={isFavorite(category.id, playlist.title) ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

if (selectedMyMusic === 'custom' && selectedCustomPlaylistId) {
  const selectedPlaylist = customPlaylists.find(
    (playlist) => playlist.id === selectedCustomPlaylistId
  );

  if (!selectedPlaylist) return null;

  return (
    <div className="page-content playlist-page">
      <section className="playlist-my-music-view">
        <div className="playlist-my-music-banner is-custom">
          <span>MY MUSIC COLLECTION</span>
          <ListMusic size={36} />
          <h1>{selectedPlaylist.name}</h1>
          <p>내 취향대로 모은 나만의 음악</p>
        </div>

        <form
          className="playlist-add-music-form"
          onSubmit={addMusicToCustomPlaylist}
        >
          <input
            type="text"
            value={newMusicTitle}
            onChange={(event) => setNewMusicTitle(event.target.value)}
            placeholder="음악 제목을 입력해 주세요."
            required
          />

          <input
            type="url"
            value={newMusicUrl}
            onChange={(event) => setNewMusicUrl(event.target.value)}
            placeholder="유튜브 영상 또는 재생목록 주소"
            required
          />

          <button type="submit">+ 음악 추가</button>
        </form>

        <div className="playlist-section-heading">
          <ListMusic size={20} />
          <h2>내 음악 목록</h2>
          <span>{selectedPlaylist.items.length}곡</span>
        </div>

        {selectedPlaylist.items.length > 0 ? (
          <div className="playlist-custom-song-list">
            {selectedPlaylist.items.map((music, index) => (
              <div className="playlist-custom-song" key={music.id}>
                <button
                  type="button"
                  className="playlist-custom-song-info"
                  onClick={() =>
                    window.open(music.url, '_blank', 'noopener,noreferrer')
                  }
                >
                  <span className="playlist-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <strong>{music.title}</strong>
                    <span>YouTube에서 듣기</span>
                  </div>

                  <ArrowUpRight size={19} />
                </button>

                <button
                  type="button"
                  className="playlist-custom-song-delete"
                  onClick={() =>
                    setCustomPlaylists((previous) =>
                      previous.map((playlist) =>
                        playlist.id === selectedPlaylist.id
                          ? {
                              ...playlist,
                              items: playlist.items.filter(
                                (item) => item.id !== music.id
                              ),
                            }
                          : playlist
                      )
                    )
                  }
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="playlist-my-music-empty">
            <Headphones size={35} />
            <strong>아직 추가한 음악이 없어요.</strong>
            <p>좋아하는 유튜브 음악을 추가해 보세요.</p>
          </div>
        )}
      </section>
    </div>
  );
}

if (selectedMyMusic) {
  const isFavorites = selectedMyMusic === 'favorites';

  return (
    <div className="page-content playlist-page">
      <section className="playlist-my-music-view">
        <div className={`playlist-my-music-banner ${isFavorites ? 'is-favorites' : 'is-custom'}`}>
          <span>MY MUSIC COLLECTION</span>
          {isFavorites ? <Heart size={36} /> : <ListMusic size={36} />}
          <h1>{isFavorites ? '찜한 음악' : '나만의 플리'}</h1>
          <p>
            {isFavorites
              ? '마음에 드는 음악을 한곳에 모아보세요.'
              : '좋아하는 음악으로 나만의 플레이리스트를 만들어 보세요.'}
          </p>
        </div>

        {isFavorites ? (
          favorites.length > 0 ? (
            <div className="playlist-list">
            {favorites.map((item, index) => {
  const targetPlaylistId =
    favoritePlaylistTargets[item.id] || customPlaylists[0]?.id || '';

  return (
    <div className="playlist-list-item-wrap" key={item.id}>
      <button
        type="button"
        className="playlist-list-item"
        onClick={() => openYouTubeSearch(item.searchTerm)}
      >
        <div className="playlist-number">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="playlist-item-icon">
          <Headphones size={21} />
        </div>
        <div className="playlist-item-copy">
          <strong>{item.title}</strong>
          <span>{item.categoryTitle} · {item.description}</span>
        </div>
        <div className="playlist-open-icon">
          <ArrowUpRight size={19} />
        </div>
      </button>

      {customPlaylists.length > 0 && (
        <div className="playlist-favorite-actions">
          <select
            value={targetPlaylistId}
            onChange={(event) =>
              setFavoritePlaylistTargets((previous) => ({
                ...previous,
                [item.id]: event.target.value,
              }))
            }
          >
            {customPlaylists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              addFavoriteToCustomPlaylist(item, targetPlaylistId)
            }
          >
            담기
          </button>
        </div>
      )}

      <button
        type="button"
        className="playlist-favorite-button is-active"
        onClick={() =>
          setFavorites((previous) =>
            previous.filter((saved) => saved.id !== item.id)
          )
        }
        aria-label="찜 해제"
      >
        <Heart size={20} fill="currentColor" />
      </button>
    </div>
  );
})}
            </div>
          ) : (
            <div className="playlist-my-music-empty">
              <Heart size={35} />
              <strong>아직 찜한 음악이 없어요.</strong>
              <p>마음에 드는 음악에 하트를 눌러 저장해 보세요.</p>
            </div>
          )
        ) : (
          <div className="playlist-custom-manager">
            <form
              className="playlist-create-form"
              onSubmit={(event) => {
                event.preventDefault();
                createCustomPlaylist();
              }}
            >
              <input
                type="text"
                value={newPlaylistName}
                onChange={(event) => setNewPlaylistName(event.target.value)}
                placeholder="새 플레이리스트 이름을 입력해 주세요."
                maxLength={40}
              />
              <button type="submit" disabled={!newPlaylistName.trim()}>
                + 플리 만들기
              </button>
            </form>

            {customPlaylists.length > 0 ? (
              <div className="playlist-custom-grid">
            {customPlaylists.map((playlist) => (
  <div className="playlist-custom-card-wrap" key={playlist.id}>
    <button
      type="button"
      className="playlist-custom-card-open"
      onClick={() => openCustomPlaylist(playlist.id)}
    >
      <div className="playlist-custom-card-icon">
        <ListMusic size={25} />
      </div>
      <div className="playlist-custom-card-copy">
        <strong>{playlist.name}</strong>
        <span>{playlist.items.length}곡</span>
      </div>
      <ArrowUpRight size={19} />
    </button>

    <div className="playlist-custom-card-actions">
      <button
        type="button"
        onClick={() => renameCustomPlaylist(playlist)}
        aria-label="플레이리스트 이름 수정"
      >
        <Pencil size={16} />
      </button>

      <button
        type="button"
        onClick={() => deleteCustomPlaylist(playlist.id)}
        aria-label="플레이리스트 삭제"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
))}
              </div>
            ) : (
              <div className="playlist-my-music-empty">
                <ListMusic size={35} />
                <strong>나만의 플레이리스트를 만들어 보세요.</strong>
                <p>이름을 정하고 좋아하는 음악을 하나씩 모아보세요.</p>
              </div>
            )}
          </div>
        )}
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
          <span>원하는 카테고를 선택해 보세요.</span>
        </div>

    <div className="playlist-category-grid">
  {categories.map((category) => {
    const CategoryIcon = category.icon;

    return (
      <button
        type="button"
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

      <section className="playlist-my-music-section">
        <div className="playlist-my-music-heading">
          <div>
            <span>MY MUSIC</span>
            <h2>나만의 음악 보관함</h2>
          </div>
          <Music2 size={22} />
        </div>

        <div className="playlist-my-music-grid">
          <button
            type="button"
            className="playlist-personal-card favorites-card"
            onClick={() => openMyMusic('favorites')}
          >
            <div className="playlist-personal-icon">
              <Heart size={27} />
            </div>
            <div>
              <strong>찜한 음악</strong>
              <span>좋아하는 음악을 모아보세요.</span>
            </div>
            <ArrowUpRight size={19} />
          </button>

          <button
            type="button"
            className="playlist-personal-card custom-card"
            onClick={() => openMyMusic('custom')}
          >
            <div className="playlist-personal-icon">
              <ListMusic size={27} />
            </div>
            <div>
              <strong>나만의 플리</strong>
              <span>내 취향대로 음악을 만들어 보세요.</span>
            </div>
            <ArrowUpRight size={19} />
          </button>
        </div>
      </section>
    </div>
  );
}
