import { useState, useEffect } from 'react';
import { sessionAPI } from '../services/api';
import { Users, Zap, Shield, ArrowRight, Pencil, Shapes, MessageSquare, Download, Plus, LogIn } from 'lucide-react';

export default function LandingPage({ onJoinSession, onGoAdmin }) {
  const [createName, setCreateName] = useState('');
  const [createUser, setCreateUser] = useState('');
  const [joinId, setJoinId] = useState('');
  const [joinUser, setJoinUser] = useState('');
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    sessionAPI.getAll().then(sessions => {
      const active = sessions.filter(s => s.active).length;
      setStats({ total: sessions.length, active });
    }).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createName.trim() || !createUser.trim()) return setError('Fill in all fields');
    setLoading('create'); setError('');
    try {
      const session = await sessionAPI.create({ name: createName, ownerName: createUser, ownerId: 'u-' + Date.now() });
      onJoinSession(session, createUser);
    } catch {
      setError('Could not connect to server. Make sure the backend is running.');
    } finally { setLoading(''); }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinId.trim() || !joinUser.trim()) return setError('Fill in all fields');
    setLoading('join'); setError('');
    try {
      const session = await sessionAPI.getById(joinId.trim());
      if (!session) return setError('Session not found. Check the ID and try again.');
      onJoinSession(session, joinUser);
    } catch {
      setError('Could not connect to server.');
    } finally { setLoading(''); }
  };

  return (
    <div className="landing">
      <nav className="landing-nav">
        <a className="nav-logo" href="#">
          <div className="nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          CollabBoard
        </a>
        <div className="nav-actions">
          <button className="btn btn-secondary btn-sm" onClick={onGoAdmin}>
            <Shield size={14} /> Admin
          </button>
        </div>
      </nav>

      <div className="landing-hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Real-time Collaboration · Multi-user · Live Canvas
        </div>

        <h1 className="hero-title">
          Draw, Sketch &amp; Brainstorm<br />
          <span className="gradient">Together in Real-Time</span>
        </h1>
        <p className="hero-subtitle">
          A collaborative whiteboard built for remote teams and classrooms. Draw, annotate, and ideate with your team — simultaneously, with zero lag.
        </p>

        {error && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'0.75rem 1.25rem', marginBottom:'1.5rem', color:'#f87171', fontSize:'0.85rem', maxWidth:500 }}>
            {error}
          </div>
        )}

        <div className="hero-cards">
          {/* Create Session */}
          <div className="hero-card">
            <div className="hero-card-icon" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <Plus size={22} color="#8b5cf6" />
            </div>
            <h3>Create a Session</h3>
            <form className="form-group" onSubmit={handleCreate}>
              <input id="create-board-name" className="form-input" placeholder="Board name (e.g. Sprint Planning)" value={createName} onChange={e => setCreateName(e.target.value)} />
              <input id="create-user-name" className="form-input" placeholder="Your name" value={createUser} onChange={e => setCreateUser(e.target.value)} />
              <button id="btn-create-session" type="submit" className="btn btn-primary btn-full" disabled={loading === 'create'}>
                {loading === 'create' ? <><svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Creating…</> : <><Plus size={16}/> Create Board</>}
              </button>
            </form>
          </div>

          {/* Join Session */}
          <div className="hero-card">
            <div className="hero-card-icon" style={{ background: 'rgba(6,182,212,0.15)' }}>
              <LogIn size={22} color="#06b6d4" />
            </div>
            <h3>Join a Session</h3>
            <form className="form-group" onSubmit={handleJoin}>
              <input id="join-session-id" className="form-input" placeholder="Session ID" value={joinId} onChange={e => setJoinId(e.target.value)} />
              <input id="join-user-name" className="form-input" placeholder="Your name" value={joinUser} onChange={e => setJoinUser(e.target.value)} />
              <button id="btn-join-session" type="submit" className="btn btn-cyan btn-full" disabled={loading === 'join'}>
                {loading === 'join' ? 'Joining…' : <><ArrowRight size={16}/> Join Board</>}
              </button>
            </form>
          </div>
        </div>

        <div className="features-strip">
          {[
            [Pencil, 'Pen & Eraser'],
            [Shapes, 'Shapes & Text'],
            [Users, 'Live Cursors'],
            [MessageSquare, 'Built-in Chat'],
            [Download, 'Export PNG / PDF'],
            [Zap, 'Zero-latency Sync'],
          ].map(([Icon, label]) => (
            <div key={label} className="feature-chip">
              <Icon size={13} /> {label}
            </div>
          ))}
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Boards</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active Sessions</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">∞</div>
          <div className="stat-label">Collaborators</div>
        </div>
      </div>
    </div>
  );
}
