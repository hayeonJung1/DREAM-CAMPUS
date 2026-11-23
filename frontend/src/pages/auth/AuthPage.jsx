
import React, { useEffect, useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, UserRound, X } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import './AuthPage.css';

export default function AuthPage({ onLogin, initialMode = 'login', onCancel }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  const handlePopState = (event) => {
    const state = event.state || {};

    if (state.dreamCampusAuth) {
      setMode(state.dreamCampusAuthMode || 'login');
      setPassword('');
      setConfirmPassword('');
    }
  };

  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, []);

  const handleModeChange = (nextMode) => {
  if (nextMode === mode) return;

  const currentState = window.history.state || {};
  const currentDepth = Number(currentState.dreamCampusAuthDepth) || 1;

  window.history.pushState(
    {
      ...currentState,
      dreamCampusAuth: true,
      dreamCampusAuthMode: nextMode,
      dreamCampusAuthDepth: currentDepth + 1,
    },
    '',
    window.location.href
  );

  setMode(nextMode);
  setMessage('');
  setPassword('');
  setConfirmPassword('');
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (mode === 'register' && password !== confirmPassword) {
      setMessage('비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setMessage('이름을 입력해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = mode === 'login'
        ? '/api/auth/login'
        : '/api/auth/register';

      const body = mode === 'login'
        ? { email, password }
        : { email, password, name: name.trim() };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || '요청 처리에 실패했습니다.');
      }

     if (mode === 'register') {
  setMessage('회원가입이 완료되었습니다. 로그인해 주세요.');
  setPassword('');
  setConfirmPassword('');

  const currentState = window.history.state || {};
  const currentDepth = Number(currentState.dreamCampusAuthDepth) || 1;

  if (currentDepth > 1) {
    window.history.back();
  } else {
    window.history.replaceState(
      {
        ...currentState,
        dreamCampusAuth: true,
        dreamCampusAuthMode: 'login',
      },
      '',
      window.location.href
    );

    setMode('login');
  }

  return;
}

      if (!result.data?.userId) {
        throw new Error('회원 정보를 확인할 수 없습니다.');
      }

      onLogin(result.data);
    } catch (error) {
      setMessage(error.message || '서버와 통신할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-page">
        <header className="auth-topbar">
          <span className="auth-topbar-title">DREAM-CAMPUS 통합회원</span>
          <button
            type="button"
            className="auth-close-button"
            onClick={() => onCancel?.()}
            aria-label="메인으로 돌아가기"
          >
            <X size={29} />
          </button>
        </header>

        <div className="auth-main">
          <section className="auth-card">
            <div className="auth-brand">
              <span className="auth-brand-mark">DC</span>
              <span>DREAM CAMPUS</span>
            </div>

            <div className="auth-heading">
              <span className="auth-eyebrow">
                {mode === 'login' ? 'MEMBER LOGIN' : 'JOIN DREAM-CAMPUS'}
              </span>
              <h1>{mode === 'login' ? '로그인' : '회원가입'}</h1>
              <p>
                {mode === 'login'
                  ? '로그인하여 나만의 학습 공간을 이용해 보세요.'
                  : 'DREAM-CAMPUS 회원으로 가입하고 학습 기록을 관리해 보세요.'}
              </p>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={mode === 'login' ? 'active' : ''}
                onClick={() => handleModeChange('login')}
              >
                로그인
              </button>
              <button
                type="button"
                className={mode === 'register' ? 'active' : ''}
                onClick={() => handleModeChange('register')}
              >
                회원가입
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label className="auth-field">
                  <span>이름</span>
                  <div className="auth-input-wrap">
                    <UserRound size={19} />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="이름을 입력해 주세요."
                      maxLength={50}
                      autoComplete="name"
                      required
                    />
                  </div>
                </label>
              )}

              <label className="auth-field">
                <span>이메일</span>
                <div className="auth-input-wrap">
                  <Mail size={19} />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="이메일을 입력해 주세요."
                    maxLength={100}
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>비밀번호</span>
                <div className="auth-input-wrap">
                  <LockKeyhole size={19} />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={
                      mode === 'register'
                        ? '8자 이상 입력해 주세요.'
                        : '비밀번호를 입력해 주세요.'
                    }
                    minLength={mode === 'register' ? 8 : undefined}
                    maxLength={72}
                    autoComplete={
                      mode === 'login' ? 'current-password' : 'new-password'
                    }
                    required
                  />
                </div>
              </label>

              {mode === 'register' && (
                <label className="auth-field">
                  <span>비밀번호 확인</span>
                  <div className="auth-input-wrap">
                    <LockKeyhole size={19} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="비밀번호를 다시 입력해 주세요."
                      maxLength={72}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </label>
              )}

              {message && (
                <div className="auth-message" role="alert">
                  {message}
                </div>
              )}

              <button
                className="auth-submit-button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? '처리 중...'
                  : mode === 'login' ? '로그인' : '회원가입'}
                {!isLoading && <ArrowRight size={19} />}
              </button>
            </form>

            <p className="auth-switch-message">
              {mode === 'login'
                ? '아직 계정이 없으신가요?'
                : '이미 계정이 있으신가요?'}
              <button
                type="button"
                onClick={() =>
                  handleModeChange(mode === 'login' ? 'register' : 'login')
                }
              >
                {mode === 'login' ? '회원가입' : '로그인'}
              </button>
            </p>

            <p className="auth-footer">
              DREAM CAMPUS · 나만의 학습 공간
            </p>
          </section>
        </div>
      </div>
    </AuthLayout>
  );
}
