import React from 'react';

/** 로그인·회원가입 화면에서 공통으로 사용할 레이아웃 */
export default function AuthLayout({ children }) {
  return <main className="auth-layout">{children}</main>;
}
