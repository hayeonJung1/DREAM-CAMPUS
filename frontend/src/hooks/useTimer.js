import { useEffect, useState } from 'react';

/**
 * 화면에 보여줄 경과 시간(초)을 돌려준다.
 *
 * session: { status, elapsedSeconds, syncedAt, ... }
 *   - elapsedSeconds: 서버가 응답한 시점의 순수 공부 시간
 *   - syncedAt      : 그 응답을 화면이 받은 시각 (Date.now())
 *
 * 공부 중이면 "서버 경과 시간 + 응답을 받은 뒤 흐른 시간"으로 센다.
 * 매 초 1을 더하는 방식이 아니라 현재 시각으로 다시 계산하므로,
 * 탭이 백그라운드에 있다 돌아와도 시간이 어긋나지 않는다.
 */
export function useTimer(session) {
  const [now, setNow] = useState(() => Date.now());
  const running = session?.status === 'RUNNING';
  const syncedAt = session?.syncedAt;

  useEffect(() => {
    if (!running) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running, syncedAt]);

  if (!session) return 0;
  if (!running) return session.elapsedSeconds;   // 일시정지·종료: 멈춘 값 그대로
  return session.elapsedSeconds + Math.max(0, Math.floor((now - syncedAt) / 1000));
}