import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Heart, MapPin, Phone } from 'lucide-react';
import {
  addFavoriteUniversity,
  getUniversity,
  removeFavoriteUniversity,
} from '../../api/universityApi.js';
import { kakaoMapSearchUrl } from '../../utils/kakaoMap.js';
import KakaoMap from './KakaoMap.jsx';

// "1946-08-22" → "1946년 8월 22일"
const formatDate = (text) => {
  if (!text) return '-';
  const [y, m, d] = text.split('-').map(Number);
  return `${y}년 ${m}월 ${d}일`;
};

export default function UniversityDetailPanel({ universityId, onBack }) {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [campusIndex, setCampusIndex] = useState(0);

  useEffect(() => {
    let ignore = false;
    getUniversity(universityId)
      .then((res) => {
        if (!ignore) setDetail(res);
      })
      .catch((e) => {
        if (!ignore) setError(e.message);
      });
    return () => {
      ignore = true;
    };
  }, [universityId]);

  const toggleFavorite = async () => {
    if (!detail.loggedIn) {
      setNotice('로그인하면 관심 대학을 저장할 수 있어요.');
      return;
    }
    setBusy(true);
    setNotice('');
    setError('');
    try {
      if (detail.favorite) await removeFavoriteUniversity(universityId);
      else await addFavoriteUniversity(universityId);
      setDetail((prev) => ({ ...prev, favorite: !prev.favorite }));
    } catch (e) {
      if (e.status === 401) {
        setNotice('로그인 정보가 없어요. 로그인한 뒤에 다시 시도해 주세요.');
        setDetail((prev) => ({ ...prev, loggedIn: false }));
      } else {
        setError(e.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const backButton = (
    <button type="button" className="uni-back" onClick={onBack}>
      <ArrowLeft size={15} /> 목록으로
    </button>
  );

  if (!detail) {
    return (
      <section className="panel uni-panel">
        {backButton}
        {error ? <p className="uni-error" role="alert">{error}</p> : <p className="uni-empty">불러오는 중이에요...</p>}
      </section>
    );
  }

  const campuses = detail.campuses;
  const campus = campuses[Math.min(campusIndex, campuses.length - 1)];
  const isCyber = detail.schoolCategory?.includes('사이버');

  return (
    <>
      <section className="panel uni-panel">
        {backButton}

        <div className="uni-detail-head">
          <div>
            <h2 className="uni-detail-name">{detail.name}</h2>
            {detail.nameEn && <p className="uni-card-en">{detail.nameEn}</p>}
            <div className="uni-chip-row">
              <span className="uni-chip">{detail.category}</span>
              {detail.establishmentType && <span className="uni-chip">{detail.establishmentType}</span>}
              {detail.schoolCategory && <span className="uni-chip is-soft">{detail.schoolCategory}</span>}
            </div>
          </div>
          <button
            type="button"
            className={`uni-favorite-button ${detail.favorite ? 'is-on' : ''}`}
            onClick={toggleFavorite}
            disabled={busy}
            aria-pressed={detail.favorite}
          >
            <Heart size={16} fill={detail.favorite ? 'currentColor' : 'none'} />
            {detail.favorite ? '관심 대학' : '관심 등록'}
          </button>
        </div>

        {notice && <p className="uni-notice" role="status">{notice}</p>}
        {error && <p className="uni-error" role="alert">{error}</p>}

        <dl className="uni-info-grid">
          <div><dt>구분</dt><dd>{detail.category} · {detail.schoolCategory}</dd></div>
          <div><dt>설립 구분</dt><dd>{detail.establishmentType || '-'}</dd></div>
          <div><dt>설립일</dt><dd>{formatDate(detail.establishedDate)}</dd></div>
          <div><dt>캠퍼스(서울)</dt><dd>{campuses.length}곳</dd></div>
        </dl>

        <div className="uni-link-row">
          {detail.homepageUrl ? (
            <a className="primary-button uni-link-button" href={detail.homepageUrl} target="_blank" rel="noopener noreferrer">
              홈페이지 방문 <ExternalLink size={14} />
            </a>
          ) : (
            <span className="uni-muted">등록된 홈페이지가 없어요.</span>
          )}
          <a className="uni-link-secondary" href={kakaoMapSearchUrl(detail.name)} target="_blank" rel="noopener noreferrer">
            카카오맵에서 보기 <ExternalLink size={14} />
          </a>
        </div>
      </section>

      <section className="panel uni-panel">
        <div className="uni-section-title"><MapPin size={17} /> 위치</div>

        {campuses.length === 0 ? (
          <p className="uni-empty">등록된 캠퍼스 위치가 없어요.</p>
        ) : (
          <>
            {campuses.length > 1 && (
              <div className="uni-filter-row" role="radiogroup" aria-label="캠퍼스 선택">
                {campuses.map((item, index) => (
                  <button
                    key={item.address}
                    type="button"
                    role="radio"
                    aria-checked={index === campusIndex}
                    className={`uni-filter ${index === campusIndex ? 'is-selected' : ''}`}
                    onClick={() => setCampusIndex(index)}
                  >
                    {item.branchType || `캠퍼스 ${index + 1}`}
                  </button>
                ))}
              </div>
            )}

            {campus.address ? (
              <KakaoMap key={campus.address} address={campus.address} />
            ) : (
              <p className="uni-empty">이 캠퍼스는 주소가 등록되어 있지 않아요.</p>
            )}

            <ul className="uni-campus-info">
              <li><MapPin size={14} /> {campus.address || '-'}{campus.postcode && ` (${campus.postcode})`}</li>
              {campus.phone && <li><Phone size={14} /> <a href={`tel:${campus.phone.replace(/[^0-9+]/g, '')}`}>{campus.phone}</a></li>}
              {campus.fax && <li className="uni-muted">팩스 {campus.fax}</li>}
            </ul>

            {isCyber && <p className="uni-muted">사이버대학은 강의를 온라인으로 진행해서, 이 위치는 학교 사무실(본부)이에요.</p>}
          </>
        )}
      </section>
    </>
  );
}