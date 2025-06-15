import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

axios.defaults.baseURL = 'http://localhost:8080';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    console.log("보내는 메시지:", input);
    console.log("요청 URL:", '/chat');
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post('/chat', { message: input }); // ✅ Spring API 호출
      const botMessage = { sender: 'bot', text: response.data };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: '⚠️ 오류가 발생했습니다. 다시 시도해주세요.' }
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-header">챗봇 상담</div>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>전송</button>
      </div>
    </div>
  );
}