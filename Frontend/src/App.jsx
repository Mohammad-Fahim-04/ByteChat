import './App.css';
import './Auth.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import { useEffect, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function AppContent() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bytechat_theme') || 'dark';
    }
    return 'dark';
  });
  const [autoCopyCode, setAutoCopyCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bytechat_auto_copy_code');
      return saved === null ? true : saved === 'true';
    }
    return true;
  });
  const [responseSpeed, setResponseSpeed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bytechat_response_speed') || 'normal';
    }
    return 'normal';
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('bytechat_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bytechat_auto_copy_code', String(autoCopyCode));
  }, [autoCopyCode]);

  useEffect(() => {
    localStorage.setItem('bytechat_response_speed', responseSpeed);
  }, [responseSpeed]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    theme, setTheme,
    autoCopyCode, setAutoCopyCode,
    responseSpeed, setResponseSpeed
  };

  return (
    <MyContext.Provider value={providerValues}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={
            <div className={`app ${theme}`}>
              <Sidebar />
              <ChatWindow />
            </div>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </MyContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App