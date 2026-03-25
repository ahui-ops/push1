import { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import ChatWindow from "./components/ChatWindow";
import Sidebar from "./components/Sidebar";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProfilePage from "./components/ProfilePage";
import { conversations, messages } from "./data/mock";

function ChatApp() {
  const [activeConversationId, setActiveConversationId] = useState(conversations[0].id);
  const activeConversation = conversations.find((item) => item.id === activeConversationId) ?? conversations[0];
  const activeMessages = messages.filter((item) => item.conversationId === activeConversation.id);

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />
      <Sidebar conversations={conversations} activeConversationId={activeConversation.id} onSelect={setActiveConversationId} />
      <ChatWindow conversation={activeConversation} messages={activeMessages} />
      <aside className="inspector">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="eyebrow">Current Focus</p>
          <Link to="/profile" className="btn btn-secondary" style={{ padding: '4px 8px', height: 'auto', fontSize: '0.75rem', width: 'auto' }}>Profile</Link>
        </div>
        <h3>Milestone M2</h3>
        <ul className="inspector-list">
          <li>登录后拉取 bootstrap bundle</li>
          <li>私聊与群聊共用消息流组件</li>
          <li>未读、置顶、免打扰状态统一在会话侧栏体现</li>
          <li>WebSocket 负责推送，REST 负责补偿</li>
          <li>UI 采用 iMessage 风格</li>
        </ul>
        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <Link to="/login" className="link text-secondary" style={{ fontSize: '0.85rem' }}>Switch Account</Link>
        </div>
      </aside>
    </div>
  );
}

export default function App() {
  // Mock auth state - default to false so user sees login page
  const isAuthenticated = localStorage.getItem("auth_token") !== null;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <ChatApp /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
