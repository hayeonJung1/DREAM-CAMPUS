import React, { useEffect, useState } from 'react';
import './YeotGame.css';

const STORAGE_KEY = 'dream-campus-yeot-game-v2';
const LEGACY_STORAGE_KEY = 'dream-campus-yeot-game-v1';

const LANDING_SPOTS = [
  { x: 29, y: 43, rotate: -16 },
  { x: 38, y: 51, rotate: 12 },
  { x: 47, y: 42, rotate: -8 },
  { x: 57, y: 50, rotate: 19 },
  { x: 67, y: 43, rotate: -13 },
  { x: 34, y: 61, rotate: 22 },
  { x: 45, y: 57, rotate: -19 },
  { x: 56, y: 61, rotate: 9 },
  { x: 68, y: 58, rotate: -5 },
  { x: 73, y: 49, rotate: 16 },
  { x: 25, y: 55, rotate: -10 },
  { x: 51, y: 37, rotate: 14 },
];

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function readSavedGame() {
  const today = getTodayKey();
  const empty = { total: 0, today: 0, date: today, attached: [] };

  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (current) {
      const parsed = JSON.parse(current);
      return {
        total: Number.isFinite(parsed.total) ? Math.max(0, parsed.total) : 0,
        today: parsed.date === today && Number.isFinite(parsed.today) ? Math.max(0, parsed.today) : 0,
        date: today,
        attached: Array.isArray(parsed.attached)
          ? parsed.attached
              .filter((item) => item && (item.type === 'yeot' || item.type === 'ricecake'))
              .slice(-18)
          : [],
      };
    }

    // 이전 프로토타입의 누적 횟수는 보존하고, 새 버전의 교문 장식은 새로 시작함.
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      return {
        ...empty,
        total: Number.isFinite(parsed.total) ? Math.max(0, parsed.total) : 0,
        today: parsed.date === today && Number.isFinite(parsed.today) ? Math.max(0, parsed.today) : 0,
      };
    }
  } catch (error) {
    console.warn('합격 기원 기록을 불러오지 못했어요.', error);
  }

  return empty;
}

function CandyGraphic({ type, small = false }) {
  if (type === 'ricecake') {
    return (
      <svg
        className={`yg-candy yg-candy-ricecake ${small ? 'yg-candy-small' : ''}`}
        viewBox="0 0 56 56"
        role="img"
        aria-label="하얀 찹쌀떡"
      >
        <defs>
          <radialGradient id="yg-rice-gradient" cx="35%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="72%" stopColor="#F8F7F2" />
            <stop offset="100%" stopColor="#E7E4DC" />
          </radialGradient>
        </defs>
        <ellipse cx="28" cy="47" rx="17" ry="4" fill="#77736A" opacity=".14" />
        <path d="M10 29 C9 18 17 9 28 8 C40 7 48 16 47 29 C46 41 39 48 28 48 C17 48 10 41 10 29Z" fill="url(#yg-rice-gradient)" stroke="#D9D6CE" strokeWidth="1.4" />
        <path d="M16 20 C19 13 26 11 32 12" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity=".95" />
        <g fill="#E5E1D7" opacity=".8">
          <circle cx="17" cy="31" r="1" /><circle cx="24" cy="18" r=".9" /><circle cx="37" cy="25" r="1" /><circle cx="32" cy="39" r=".9" /><circle cx="21" cy="40" r=".8" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      className={`yg-candy yg-candy-yeot ${small ? 'yg-candy-small' : ''}`}
      viewBox="0 0 120 38"
      role="img"
      aria-label="길쭉한 하얀 엿"
    >
      <defs>
        <linearGradient id="yg-yeot-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="48%" stopColor="#F7F6F1" />
          <stop offset="100%" stopColor="#E6E3DA" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="31" rx="49" ry="4" fill="#77736A" opacity=".13" />
      <path d="M10 18 C14 9 28 8 42 10 C57 7 75 9 89 10 C101 10 109 13 111 18 C109 24 100 28 88 27 C72 30 55 28 41 28 C26 29 14 26 10 18Z" fill="url(#yg-yeot-gradient)" stroke="#D8D6CF" strokeWidth="1.5" />
      <path d="M18 15 C35 11 55 14 70 13 C84 12 96 14 103 17" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity=".95" />
      <path d="M16 22 C31 25 42 22 54 23" fill="none" stroke="#E2DFD6" strokeWidth="1.1" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

function UniversityGate({ universityName }) {
  const displayName = universityName || '나의 목표 대학';
  const fontSize = displayName.length > 14 ? 17 : displayName.length > 9 ? 20 : 24;

  return (
    <svg className="yg-gate-art" viewBox="0 0 760 430" role="img" aria-label={`${displayName} 합격을 기원하는 DREAM CAMPUS 교문`}>
      <defs>
        <linearGradient id="yg-stone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E9E8E1" />
          <stop offset="48%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E5E4DC" />
        </linearGradient>
        <linearGradient id="yg-sign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F7F7F2" />
        </linearGradient>
      </defs>

      {/* 흰 배경과 정돈된 캠퍼스 앞마당 */}
      <rect width="760" height="430" fill="#FFFFFF" />
      <path d="M0 337 Q150 320 300 337 T600 332 T760 339 V430 H0Z" fill="#F5F6F2" />
      <path d="M285 430 Q340 349 380 342 Q420 349 475 430Z" fill="#EAECE5" />
      <path d="M350 430 L380 347 L410 430" fill="none" stroke="#D9DDD3" strokeWidth="2" strokeDasharray="7 8" />

      {/* 작은 구름 */}
      <g fill="#F7F8F5">
        <path d="M103 112 C103 101 112 94 123 96 C127 82 146 79 155 91 C168 87 181 96 181 108 C181 116 173 121 163 121 H119 C110 121 103 118 103 112Z" />
        <path d="M573 93 C573 83 582 77 592 79 C597 66 613 64 622 75 C635 71 647 80 647 91 C647 99 640 104 630 104 H590 C580 104 573 101 573 93Z" />
      </g>

      {/* 양쪽 나무와 둥근 수풀 */}
      <g>
        <path d="M82 335 Q91 258 108 213" stroke="#9A8064" strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M106 255 L76 224 M103 277 L132 237" stroke="#9A8064" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="75" cy="215" r="35" fill="#B9CDB5" /><circle cx="111" cy="198" r="42" fill="#C9D8C3" /><circle cx="139" cy="225" r="30" fill="#AFC6AA" />
        <path d="M670 335 Q660 259 645 213" stroke="#9A8064" strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M648 255 L678 224 M651 277 L622 237" stroke="#9A8064" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="685" cy="215" r="35" fill="#B9CDB5" /><circle cx="649" cy="198" r="42" fill="#C9D8C3" /><circle cx="621" cy="225" r="30" fill="#AFC6AA" />
      </g>

      {/* 교문 기둥 */}
      <g stroke="#AEB8AC" strokeWidth="3">
        <rect x="166" y="176" width="82" height="190" rx="15" fill="url(#yg-stone)" />
        <rect x="512" y="176" width="82" height="190" rx="15" fill="url(#yg-stone)" />
        <rect x="153" y="166" width="108" height="24" rx="9" fill="#FDFDF9" />
        <rect x="499" y="166" width="108" height="24" rx="9" fill="#FDFDF9" />
      </g>
      <g fill="#D7DED3">
        <rect x="181" y="210" width="52" height="5" rx="2.5" />
        <rect x="527" y="210" width="52" height="5" rx="2.5" />
      </g>

      {/* 둥근 아치 */}
      <path d="M205 181 C235 89 525 89 555 181" fill="none" stroke="#718777" strokeWidth="25" strokeLinecap="round" />
      <path d="M216 177 C249 111 511 111 544 177" fill="none" stroke="#AFC0AE" strokeWidth="7" strokeLinecap="round" />
      <path d="M208 184 H552" stroke="#718777" strokeWidth="13" strokeLinecap="round" />

      {/* 학교 이름 현판 */}
      <rect x="250" y="142" width="260" height="61" rx="15" fill="url(#yg-sign)" stroke="#AAB7A8" strokeWidth="3" />
      <rect x="259" y="151" width="242" height="43" rx="10" fill="#FFFFFF" stroke="#E4E8E0" strokeWidth="1.5" />
      <text x="380" y="179" textAnchor="middle" fontSize={fontSize} fontWeight="800" fill="#4F6654" letterSpacing="-.5" textLength="220" lengthAdjust="spacingAndGlyphs">{displayName}</text>
      <circle cx="380" cy="123" r="12" fill="#E5B86B" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M374 123 L379 128 L387 118" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

      {/* 기둥 하단 작은 장식 */}
      <g fill="#E6E9E0" stroke="#AEB8AC" strokeWidth="2">
        <rect x="157" y="357" width="100" height="18" rx="8" />
        <rect x="503" y="357" width="100" height="18" rx="8" />
      </g>

      {/* 화단과 작은 꽃 */}
      <g>
        <path d="M96 375 Q123 343 156 375Z" fill="#B7CBAF" />
        <path d="M604 375 Q637 343 666 375Z" fill="#B7CBAF" />
        <g fill="#F2C9BD"><circle cx="116" cy="354" r="6"/><circle cx="136" cy="365" r="5"/><circle cx="625" cy="364" r="6"/><circle cx="646" cy="353" r="5"/></g>
        <g fill="#E5B86B"><circle cx="116" cy="354" r="2"/><circle cx="136" cy="365" r="2"/><circle cx="625" cy="364" r="2"/><circle cx="646" cy="353" r="2"/></g>
      </g>
    </svg>
  );
}

export default function YeotGame({ universityName = '', onBack }) {
  const [gameData, setGameData] = useState(readSavedGame);
  const [selectedCandy, setSelectedCandy] = useState('yeot');
  const [activeThrow, setActiveThrow] = useState(null);
  const [message, setMessage] = useState('합격 기운을 담아 던져보자!');

  const schoolName = String(universityName || '').trim();
  const displaySchool = schoolName || '나의 목표 대학';

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
    } catch (error) {
      console.warn('합격 기원 기록을 저장하지 못했어요.', error);
    }
  }, [gameData]);

  const throwCandy = () => {
    if (activeThrow) return;

    const today = getTodayKey();
    const nextSpotIndex = Math.floor(Math.random() * LANDING_SPOTS.length);
    const spot = LANDING_SPOTS[nextSpotIndex];
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setGameData((previous) => ({
      ...previous,
      total: previous.total + 1,
      today: previous.date === today ? previous.today + 1 : 1,
      date: today,
    }));
    setActiveThrow({ id, ...spot, type: selectedCandy });
    setMessage(selectedCandy === 'yeot' ? '쭈욱— 합격엿이 날아간다!' : '통통— 찹쌀떡이 날아간다!');
  };

  const finishThrow = () => {
    if (!activeThrow) return;
    setGameData((previous) => ({
      ...previous,
      attached: [
        ...previous.attached,
        {
          id: activeThrow.id,
          x: activeThrow.x,
          y: activeThrow.y,
          rotate: activeThrow.rotate,
          type: activeThrow.type,
        },
      ].slice(-18),
    }));
    setActiveThrow(null);
    setMessage('찰싹! 소원이 교문에 붙었어. 좋은 기운 받아 가자!');
  };

  return (
    <main className="yg-page">
      <div className="yg-header-row">
        <div>
          <div className="yg-eyebrow">DREAM CAMPUS · PASS YOUR DREAM</div>
          <h1>합격 기원 던지기 <span aria-hidden="true">🍬</span></h1>
          <p>길쭉한 엿이나 찹쌀떡을 골라 목표 대학 교문에 붙여보자!</p>
        </div>
        {onBack && (
          <button type="button" className="yg-back-button" onClick={onBack}>
            ← 오락실 목록
          </button>
        )}
      </div>

      <section className="yg-game-card" aria-label="합격 기원 던지기 게임">
        <div className="yg-stats-row">
          <div className="yg-school-label">
            <span className="yg-label-caption">MY DREAM CAMPUS</span>
            <strong>{displaySchool}</strong>
            {!schoolName && <span className="yg-school-hint">마이페이지에서 목표 대학을 설정하면 교문 현판에 표시돼.</span>}
          </div>
          <div className="yg-counter-group">
            <div className="yg-counter"><span>전체 던지기</span><strong>{gameData.total.toLocaleString('ko-KR')}<small>회</small></strong></div>
            <div className="yg-counter"><span>오늘 던지기</span><strong>{gameData.today.toLocaleString('ko-KR')}<small>회</small></strong></div>
          </div>
        </div>

        <div className="yg-scene" aria-label={`${displaySchool} 교문 일러스트`}>
          <UniversityGate universityName={displaySchool} />

          {gameData.attached.map((item) => (
            <span
              className="yg-stuck-candy"
              key={item.id}
              style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `translate(-50%, -50%) rotate(${item.rotate}deg)` }}
            >
              <CandyGraphic type={item.type} small />
            </span>
          ))}

          {activeThrow && (
            <span
              key={activeThrow.id}
              className={`yg-flying-candy ${activeThrow.type === 'ricecake' ? 'is-ricecake' : 'is-yeot'}`}
              style={{
                '--yg-end-left': `${activeThrow.x}%`,
                '--yg-mid-left': `${(18 + activeThrow.x) / 2}%`,
                '--yg-end-top': `${activeThrow.y}%`,
              }}
              onAnimationEnd={finishThrow}
            >
              <CandyGraphic type={activeThrow.type} />
            </span>
          )}

          <span className="yg-scene-caption">DREAM CAMPUS의 합격 기원 교문</span>
        </div>

        <div className="yg-action-area">
          <div className="yg-message" aria-live="polite">{message}</div>
          <div className="yg-candy-picker" role="group" aria-label="던질 간식 선택">
            <button type="button" className={`yg-candy-choice ${selectedCandy === 'yeot' ? 'selected' : ''}`} onClick={() => setSelectedCandy('yeot')} disabled={Boolean(activeThrow)} aria-pressed={selectedCandy === 'yeot'}>
              <CandyGraphic type="yeot" small />
              <span><strong>길쭉한 엿</strong><small>딱 붙어라!</small></span>
            </button>
            <button type="button" className={`yg-candy-choice ${selectedCandy === 'ricecake' ? 'selected' : ''}`} onClick={() => setSelectedCandy('ricecake')} disabled={Boolean(activeThrow)} aria-pressed={selectedCandy === 'ricecake'}>
              <CandyGraphic type="ricecake" small />
              <span><strong>찹쌀떡</strong><small>찰싹 붙어라!</small></span>
            </button>
          </div>
          <button type="button" className="yg-throw-button" onClick={throwCandy} disabled={Boolean(activeThrow)}>
            {activeThrow ? '날아가는 중...' : selectedCandy === 'yeot' ? '🍬 엿 던지기!' : '🍡 찹쌀떡 던지기!'}
          </button>
          <p className="yg-howto">간식을 선택하고 버튼을 눌러봐. 교문에 붙으면 횟수가 기록돼!</p>
        </div>
      </section>

      <div className="yg-footnote">
        <span aria-hidden="true">♡</span>
        합격을 기원하는 재미용 콘텐츠야. 실제 합격 여부나 가능성을 예측하지 않아.
      </div>
    </main>
  );
}
