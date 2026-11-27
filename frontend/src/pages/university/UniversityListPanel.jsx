import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, MapPin, Search } from 'lucide-react';
import {
  addFavoriteUniversity,
  getFavoriteUniversities,
  getUniversities,
  removeFavoriteUniversity,
} from '../../api/universityApi.js';

const CATEGORIES = [
  { id: '', label: '전체' },
  { id: '대학', label: '대학' },
  { id: '전문대학', label: '전문대학' },
];

const LOGIN_NOTICE = '로그인하면 관심 대학을 저장할 수 있어요.';

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const start = Math.max(0, Math.min(page - 2, totalPages - 5));
  const end = Math.min(totalPages, start + 5);
  const numbers = [];
  for (let i = start; i < end; i += 1) numbers.push(i);

  return (
    <nav className="uni-pagination" aria-label="페이지 이동">
      <button type="button" className="uni-page-button" onClick={() => onChange(page - 1)} disabled={page === 0} aria-label="이전 페이지">
        <ChevronLeft size={16} />
      </button>
      {numbers.map((number) => (
        <button
          key={number}
          type="button"
          className={`uni-page-button ${number === page ? 'is-active' : ''}`}
          onClick={() => onChange(number)}
          aria-current={number === page ? 'page' : undefined}
        >
          {number + 1}
        </button>
      ))}
      <button type="button" className="uni-page-button" onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1} aria-label="다음 페이지">
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

function UniversityCard({ item, onOpen, onToggle, busy }) {
  // 학교 종류가 "대학교", "전문대학"이면 위의 구분과 겹쳐서 보여주지 않는다
  const showSchoolCategory = item.schoolCategory && !['대학교', '전문대학'].includes(item.schoolCategory);

  return (
    <li className="uni-card">
      <button type="button" className="uni-card-main" onClick={() => onOpen(item.universityId)}>
        <strong className="uni-card-name">{item.name}</strong>
        {item.nameEn && <span className="uni-card-en">{item.nameEn}</span>}
        <span className="uni-chip-row">
          <span className="uni-chip">{item.category}</span>
          {item.establishmentType && <span className="uni-chip">{item.establishmentType}</span>}
          {showSchoolCategory && <span className="uni-chip is-soft">{item.schoolCategory}</span>}
        </span>
        {item.address && (
          <span className="uni-card-address">
            <MapPin size={13} />
            <span>
              {item.address}
              {item.campusCount > 1 && ` 외 ${item.campusCount - 1}곳`}
            </span>
          </span>
        )}
      </button>

      <button
        type="button"
        className={`uni-heart ${item.favorite ? 'is-on' : ''}`}
        onClick={() => onToggle(item)}
        disabled={busy}
        aria-pressed={item.favorite}
        aria-label={item.favorite ? `${item.name} 관심 대학에서 빼기` : `${item.name} 관심 대학에 추가`}
      >
        <Heart size={18} fill={item.favorite ? 'currentColor' : 'none'} />
      </button>
    </li>
  );
}

export default function UniversityListPanel({ query, setQuery, onOpen }) {
  const { tab, keyword, category, page } = query;

  const [keywordInput, setKeywordInput] = useState(keyword);   // 입력창에 보이는 값
  const [data, setData] = useState(null);                      // 전체 목록 응답 (null 이면 첫 로딩 중)
  const [favorites, setFavorites] = useState(null);            // null: 불러오는 중, 'login': 로그인 필요, 배열: 목록
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);

  // 검색어 입력을 멈추고 0.3초가 지나면 검색한다 (글자마다 요청이 가지 않게)
  useEffect(() => {
    if (keywordInput.trim() === keyword) return undefined;
    const timer = setTimeout(() => {
      setQuery((q) => ({ ...q, keyword: keywordInput.trim(), page: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [keywordInput, keyword, setQuery]);

  // 전체 목록 (로그인하지 않아도 조회된다)
  useEffect(() => {
    if (tab !== 'all') return undefined;
    let ignore = false;
    setError('');
    getUniversities({ keyword, category, page })
      .then((res) => {
        if (!ignore) setData(res);
      })
      .catch((e) => {
        if (!ignore) setError(e.message);
      });
    return () => {
      ignore = true;
    };
  }, [tab, keyword, category, page]);

  // 관심 대학 목록 (로그인해야 한다)
  useEffect(() => {
    if (tab !== 'favorites') return undefined;
    let ignore = false;
    setError('');
    setFavorites(null);
    getFavoriteUniversities()
      .then((list) => {
        if (!ignore) setFavorites(list);
      })
      .catch((e) => {
        if (ignore) return;
        if (e.status === 401) setFavorites('login');
        else setError(e.message);
      });
    return () => {
      ignore = true;
    };
  }, [tab]);

  const loggedIn = tab === 'favorites' ? Array.isArray(favorites) : Boolean(data?.loggedIn);

  const changeQuery = (patch) => {
    setNotice('');
    setQuery((q) => ({ ...q, ...patch }));
  };

  const toggleFavorite = async (item) => {
    if (!loggedIn) {
      setNotice(LOGIN_NOTICE);
      return;
    }
    setBusyId(item.universityId);
    setNotice('');
    setError('');
    try {
      if (item.favorite) await removeFavoriteUniversity(item.universityId);
      else await addFavoriteUniversity(item.universityId);

      if (tab === 'favorites') {
        setFavorites((prev) => (Array.isArray(prev) ? prev.filter((u) => u.universityId !== item.universityId) : prev));
      } else {
        setData((prev) =>
          prev && {
            ...prev,
            items: prev.items.map((u) => (u.universityId === item.universityId ? { ...u, favorite: !item.favorite } : u)),
          },
        );
      }
    } catch (e) {
      if (e.status === 401) {
        setNotice(LOGIN_NOTICE);
        setData((prev) => prev && { ...prev, loggedIn: false });
      } else {
        setError(e.message);
      }
    } finally {
      setBusyId(null);
    }
  };

  const items = tab === 'favorites' ? (Array.isArray(favorites) ? favorites : null) : data?.items ?? null;

  return (
    <section className="panel uni-panel">
      <div className="uni-tabs" role="tablist" aria-label="대학 목록 종류">
        <button type="button" role="tab" aria-selected={tab === 'all'} className={`uni-tab ${tab === 'all' ? 'is-active' : ''}`} onClick={() => changeQuery({ tab: 'all' })}>
          전체 대학
        </button>
        <button type="button" role="tab" aria-selected={tab === 'favorites'} className={`uni-tab ${tab === 'favorites' ? 'is-active' : ''}`} onClick={() => changeQuery({ tab: 'favorites' })}>
          <Heart size={14} /> 관심 대학
        </button>
      </div>

      {tab === 'all' && (
        <>
          <div className="uni-search">
            <Search size={16} />
            <input
              type="search"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="대학 이름으로 검색 (예: 서울, 한양, yonsei)"
              maxLength={50}
              aria-label="대학 이름 검색"
            />
          </div>

          <div className="uni-filter-row" role="radiogroup" aria-label="대학 구분">
            {CATEGORIES.map((item) => (
              <button
                key={item.id || 'all'}
                type="button"
                role="radio"
                aria-checked={category === item.id}
                className={`uni-filter ${category === item.id ? 'is-selected' : ''}`}
                onClick={() => changeQuery({ category: item.id, page: 0 })}
              >
                {item.label}
              </button>
            ))}
            {data && <span className="uni-count">{data.totalElements}곳</span>}
          </div>
        </>
      )}

      {notice && <p className="uni-notice" role="status">{notice}</p>}
      {error && <p className="uni-error" role="alert">{error}</p>}

      {tab === 'favorites' && favorites === 'login' ? (
        <p className="uni-empty">로그인하면 마음에 드는 대학을 관심 대학으로 저장할 수 있어요.</p>
      ) : items === null ? (
        <p className="uni-empty">{error ? '' : '불러오는 중이에요...'}</p>
      ) : items.length === 0 ? (
        <p className="uni-empty">
          {tab === 'favorites'
            ? '아직 관심 대학이 없어요. 전체 대학에서 하트를 눌러 추가해 보세요.'
            : '검색 결과가 없어요. 다른 이름으로 검색해 보세요.'}
        </p>
      ) : (
        <ul className="uni-grid">
          {items.map((item) => (
            <UniversityCard
              key={item.universityId}
              item={item}
              onOpen={onOpen}
              onToggle={toggleFavorite}
              busy={busyId === item.universityId}
            />
          ))}
        </ul>
      )}

      {tab === 'all' && data && (
        <Pagination page={data.page} totalPages={data.totalPages} onChange={(next) => changeQuery({ page: next })} />
      )}
    </section>
  );
}