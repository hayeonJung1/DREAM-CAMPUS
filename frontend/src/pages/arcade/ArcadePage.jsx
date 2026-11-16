import React, { useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Bell, BookOpenCheck, CalendarDays, TrendingUp,
  CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileText, Gamepad2,
  GraduationCap, Headphones, House, Landmark, ListChecks, Menu, Music2,
  Pencil, Plus, Trash2, Search, Settings2, Sparkles, Target, Trophy,
  UserRound, X,
} from 'lucide-react';
import YeotGame from '../../components/arcade/YeotGame.jsx';
import '../../styles/arcade-menu.css';

const ARCADE_MENU_ITEMS = [
  {
    id: 'yeot',
    emoji: '🍬',
    title: '합격엿 붙이기',
    description: '길쭉한 엿이나 찹쌀떡을 목표 대학 교문에 던져봐!',
    status: '이용 가능',
    available: true,
    tone: 'peach',
  },
  {
    id: 'charm',
    emoji: '🧧',
    title: '나만의 합격 부적',
    description: '이름과 목표 대학을 담아 나만의 부적 만들기',
    status: '준비 중',
    available: false,
    tone: 'pink',
  },
  {
    id: 'fortune',
    emoji: '🔮',
    title: '오늘의 운세',
    description: '오늘의 공부운과 행운의 메시지 확인하기',
    status: '준비 중',
    available: false,
    tone: 'lavender',
  },
  {
    id: 'roulette',
    emoji: '🎯',
    title: '찍기 신 돌림판',
    description: '선택지를 돌려 오늘의 행운 번호 뽑기',
    status: '준비 중',
    available: false,
    tone: 'blue',
  },
  {
    id: 'letter',
    emoji: '💌',
    title: '미래의 나에게 편지',
    description: '지금의 마음을 미래의 나에게 남겨보기',
    status: '준비 중',
    available: false,
    tone: 'mint',
  },
  {
    id: 'break',
    emoji: '☁️',
    title: '5분 휴식 뽑기',
    description: '잠깐 쉬어갈 수 있는 작은 미션 뽑기',
    status: '준비 중',
    available: false,
    tone: 'cream',
  },
];

export default function ArcadePage({ universityName, onNavigate }) {
  const [selectedFeature, setSelectedFeature] = useState('menu');
  const hasUniversity = Boolean(String(universityName || '').trim());

  if (selectedFeature === 'yeot') {
    return (
      <div className="page-content subpage-content dc-arcade-game-page">
        <YeotGame
          universityName={universityName}
          onBack={() => setSelectedFeature('menu')}
        />
      </div>
    );
  }

  return (
    <div className="page-content subpage-content dc-arcade-page">
      <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> ARCADE</div>
      <section className="subpage-hero dc-arcade-hero">
        <div className="subpage-icon"><Gamepad2 size={30} /></div>
        <div>
          <span className="eyebrow">ARCADE &amp; CHEER UP</span>
          <h1>오락실 / 합격 응원</h1>
          <p>
            {hasUniversity
              ? `${universityName}을(를) 향한 너의 꿈을 응원해! 잠깐 쉬어가도 괜찮아.`
              : '공부하다 지칠 때, 잠깐 쉬어가며 작은 즐거움을 찾아봐!'}
          </p>
        </div>
      </section>

      <div className="dc-arcade-section-heading">
        <div>
          <span className="eyebrow">CHOOSE YOUR CONTENT</span>
          <h2>무엇을 해볼까?</h2>
        </div>
        <span className="dc-arcade-section-note">가볍게 즐기는 합격 응원 콘텐츠</span>
      </div>

      <section className="dc-arcade-card-grid" aria-label="오락실 세부 메뉴">
        {ARCADE_MENU_ITEMS.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`dc-arcade-feature-card tone-${item.tone} ${item.available ? 'is-available' : 'is-coming'}`}
            onClick={() => item.available && setSelectedFeature(item.id)}
            disabled={!item.available}
            aria-label={`${item.title}${item.available ? ' 시작' : ', 준비 중'}`}
          >
            <span className="dc-arcade-card-topline">
              <span className="dc-arcade-emoji" aria-hidden="true">{item.emoji}</span>
              <span className={`dc-arcade-status ${item.available ? 'ready' : ''}`}>{item.status}</span>
            </span>
            <strong>{item.title}</strong>
            <span className="dc-arcade-card-description">{item.description}</span>
            <span className="dc-arcade-card-action">
              {item.available ? '게임 시작하기' : '추후 추가 예정'}
              {item.available && <ArrowRight size={15} />}
            </span>
          </button>
        ))}

        <button
          type="button"
          className="dc-arcade-feature-card tone-student is-available"
          onClick={() => onNavigate('mypage')}
        >
          <span className="dc-arcade-card-topline">
            <span className="dc-arcade-emoji" aria-hidden="true">🎓</span>
            <span className="dc-arcade-status ready">바로 보기</span>
          </span>
          <strong>미래 대학생 학생증</strong>
          <span className="dc-arcade-card-description">마이페이지에 등록한 나의 미래 학생증 확인하기</span>
          <span className="dc-arcade-card-action">학생증 확인하기 <ArrowRight size={15} /></span>
        </button>
      </section>

      <p className="dc-arcade-note">※ 오락실 콘텐츠는 공부와 입시 사이에 잠깐 즐기는 응원용 기능이야.</p>
    </div>
  );
}
