const SDK_TIMEOUT_MS = 8000;
let loadPromise = null;   // 지도 SDK 는 한 번만 불러오고, 이후에는 같은 결과를 재사용한다

// 카카오 지도 SDK 를 불러온다. 실패하면 Error(message) 의 message 가 NO_KEY / SDK_LOAD_FAILED / TIMEOUT 중 하나다.
export function loadKakaoMaps() {
  const key = import.meta.env.VITE_KAKAO_JS_KEY;
  if (!key) return Promise.reject(new Error('NO_KEY'));
  if (window.kakao?.maps?.Map) return Promise.resolve(window.kakao);

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let timer = null;
      const fail = (code) => {
        window.clearTimeout(timer);
        loadPromise = null;   // 다음에 다시 시도할 수 있게 한다
        script.remove();
        reject(new Error(code));
      };

      // 도메인이 등록되지 않았을 때 등 응답이 오지 않는 경우를 대비한 제한 시간
      timer = window.setTimeout(() => fail('TIMEOUT'), SDK_TIMEOUT_MS);

      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = () => {
        if (!window.kakao?.maps) {
          fail('SDK_LOAD_FAILED');
          return;
        }
        window.kakao.maps.load(() => {
          window.clearTimeout(timer);
          resolve(window.kakao);
        });
      };
      script.onerror = () => fail('SDK_LOAD_FAILED');
      document.head.appendChild(script);
    });
  }
  return loadPromise;
}

// 주소에서 괄호 설명과 건물 동·층 정보를 빼서 위치 검색이 잘 되게 한다
// 예) "서울특별시 중랑구 망우로 353, C동 9층" → "서울특별시 중랑구 망우로 353"
export function cleanAddress(address) {
  return String(address || '')
    .replace(/\(.*?\)/g, ' ')
    .split(',')[0]
    .replace(/\s+/g, ' ')
    .trim();
}

// 카카오맵에서 검색 결과 열기 (키가 필요 없는 일반 링크)
export function kakaoMapSearchUrl(keyword) {
  return `https://map.kakao.com/link/search/${encodeURIComponent(keyword)}`;
}