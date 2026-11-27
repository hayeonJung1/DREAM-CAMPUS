import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { cleanAddress, loadKakaoMaps } from '../../utils/kakaoMap.js';

const SDK_HINT =
  '카카오 지도를 불러오지 못했어요. 카카오 개발자 사이트에서 JavaScript SDK 도메인(http://localhost:5173) 등록과 카카오맵 사용 설정을 확인해 주세요.';

const MESSAGES = {
  NO_KEY: '카카오 지도 키가 설정되지 않았어요. frontend/.env 에 VITE_KAKAO_JS_KEY 를 넣고 개발 서버를 다시 시작해 주세요.',
  SDK_LOAD_FAILED: SDK_HINT,
  TIMEOUT: SDK_HINT,
  NO_ADDRESS: '이 주소의 위치를 찾지 못했어요. 아래 "카카오맵에서 보기"로 확인해 보세요.',
};

// 주소를 좌표로 바꿔서 지도에 마커를 찍는다.
// 주소가 바뀌면 지도를 새로 만들어야 해서, 부모에서 key={address} 를 붙여 사용한다.
export default function KakaoMap({ address }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');   // loading | ready | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    loadKakaoMaps()
      .then(
        (kakao) =>
          new Promise((resolve, reject) => {
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(cleanAddress(address), (result, geoStatus) => {
              if (geoStatus === kakao.maps.services.Status.OK && result.length > 0) {
                resolve({ kakao, point: result[0] });
              } else {
                reject(new Error('NO_ADDRESS'));
              }
            });
          }),
      )
      .then(({ kakao, point }) => {
        if (ignore || !containerRef.current) return;
        const position = new kakao.maps.LatLng(Number(point.y), Number(point.x));
        const map = new kakao.maps.Map(containerRef.current, { center: position, level: 3 });
        new kakao.maps.Marker({ map, position });
        setStatus('ready');
      })
      .catch((e) => {
        if (ignore) return;
        setStatus('error');
        setMessage(MESSAGES[e.message] ?? SDK_HINT);
      });

    return () => {
      ignore = true;
    };
  }, [address]);

  return (
    <div className="uni-map-wrap">
      <div ref={containerRef} className="uni-map" role="img" aria-label={`${address} 위치 지도`} />
      {status !== 'ready' && (
        <div className="uni-map-overlay">
          {status === 'loading' ? (
            <span>지도를 불러오는 중이에요...</span>
          ) : (
            <>
              <MapPin size={22} />
              <p>{message}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}