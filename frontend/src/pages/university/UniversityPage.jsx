import { useState } from 'react';
import { ChevronRight, Landmark } from 'lucide-react';
import UniversityDetailPanel from './UniversityDetailPanel.jsx';
import UniversityListPanel from './UniversityListPanel.jsx';
import './UniversityPage.css';

export default function UniversityPage() {
  const [detailId, setDetailId] = useState(null);   // null 이면 목록, 번호가 있으면 그 대학의 상세
  // 목록의 검색 조건은 여기서 들고 있어서, 상세를 보고 돌아와도 검색어와 페이지가 그대로 남는다
  const [query, setQuery] = useState({ tab: 'all', keyword: '', category: '', page: 0 });

  return (
    <div className="page-content subpage-content">
      <div className="breadcrumb">DREAM CAMPUS <ChevronRight size={14} /> 대학교 정보</div>

      <section className="subpage-hero">
        <div className="subpage-icon"><Landmark size={30} /></div>
        <div>
          <span className="eyebrow">UNIVERSITY</span>
          <h1>대학교 정보</h1>
          <p>서울 소재 대학을 찾아보고 위치와 홈페이지를 확인해요. 마음에 드는 대학은 관심 대학으로 저장해 보세요.</p>
        </div>
      </section>

      {detailId === null ? (
        <UniversityListPanel query={query} setQuery={setQuery} onOpen={setDetailId} />
      ) : (
        <UniversityDetailPanel key={detailId} universityId={detailId} onBack={() => setDetailId(null)} />
      )}
    </div>
  );
}