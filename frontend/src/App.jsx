import { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import WhiteboardApp from './components/WhiteboardApp';
import AdminDashboard from './components/AdminDashboard';

const USER_COLORS = ['#8b5cf6','#06b6d4','#ec4899','#10b981','#f59e0b','#ef4444','#6366f1','#14b8a6'];

export default function App() {
  const [view, setView] = useState('landing'); // landing | whiteboard | admin
  const [session, setSession] = useState(null);
  const [user] = useState(() => ({
    id: crypto.randomUUID(),
    name: '',
    color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)],
  }));
  const [currentUser, setCurrentUser] = useState(user);

  const handleJoinSession = useCallback((sessionData, userName) => {
    setCurrentUser(u => ({ ...u, name: userName }));
    setSession(sessionData);
    setView('whiteboard');
  }, []);

  const handleLeaveSession = useCallback(() => {
    setSession(null);
    setView('landing');
  }, []);

  if (view === 'admin') {
    return <AdminDashboard onBack={() => setView('landing')} />;
  }

  if (view === 'whiteboard' && session) {
    return (
      <WhiteboardApp
        session={session}
        user={currentUser}
        onLeave={handleLeaveSession}
      />
    );
  }

  return (
    <LandingPage
      onJoinSession={handleJoinSession}
      onGoAdmin={() => setView('admin')}
    />
  );
}
