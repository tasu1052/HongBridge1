import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import './App.css';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('');

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo" onClick={() => setActiveMenu('')}>HONGBRIDGE</div>
        <nav className="menu">
          <button onClick={() => setActiveMenu('로그인')}>로그인</button>
          <button onClick={() => setActiveMenu('회원가입')}>회원가입</button>
        </nav>
        <nav className="menu middle-menu">
          <button onClick={() => setActiveMenu('개인정보')}>개인정보</button>
          <button onClick={() => setActiveMenu('챗봇')}>챗봇</button>
          <button onClick={() => setActiveMenu('캘린더')}>캘린더</button>
        </nav>
      </aside>
      <main className="content">
        {activeMenu === '로그인' && <div>로그인 화면입니다</div>}
        {activeMenu === '회원가입' && <div>회원가입 화면입니다</div>}
        {activeMenu === '' && <div className="home">홈 화면입니다</div>}
        {activeMenu === '챗봇' && <Chatbot />}
        {activeMenu === '개인정보' && <div>개인정보 화면입니다</div>}
        {activeMenu === '캘린더' && <div>캘린더 화면입니다</div>}
      </main>
    </div>
  );
}
