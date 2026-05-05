import { useState, useEffect, useRef } from 'react';
import { sessionAPI, chatAPI } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import WhiteboardCanvas from './WhiteboardCanvas';
import Toolbar from './Toolbar';
import Sidebar from './Sidebar';
import ExportModal from './ExportModal';
import { LogOut, Download, Users, PanelRight, Copy, Check } from 'lucide-react';

export default function WhiteboardApp({ session, user, onLeave }) {

  // ================= STATE MANAGEMENT =================

  // Drawing tool settings
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#ffffff');
  const [strokeWidth, setStrokeWidth] = useState(3);

  // Elements on canvas (loaded from session)
  const [elements, setElements] = useState(() => {
    try {
      return JSON.parse(session.elementsJson || '[]');
    } catch {
      return [];
    }
  });

  // Track other users' cursors
  const [remoteUsers, setRemoteUsers] = useState({});

  // Chat messages
  const [messages, setMessages] = useState([]);

  // Sidebar UI control
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('chat');

  // Export modal visibility
  const [showExport, setShowExport] = useState(false);

  // Connection status
  const [connected, setConnected] = useState(false);

  // Copy session ID feedback
  const [copied, setCopied] = useState(false);

  // Refs for canvas and auto-save timer
  const canvasRef = useRef(null);
  const saveTimerRef = useRef(null);

  // ================= INITIAL DATA LOADING =================

  // Load previous chat messages
  useEffect(() => {
    chatAPI.getHistory(session.id)
      .then(msgs => {
        setMessages(msgs.map(m => ({ ...m, timestamp: m.timestamp })));
      })
      .catch(() => {});
  }, [session.id]);

  // ================= WEBSOCKET EVENT HANDLERS =================

  // Handle drawing + user events from WebSocket
  const handleBoardEvent = (event) => {
    switch (event.type) {

      // Add new element
      case 'ELEMENT_ADD':
        setElements(prev => [...prev, event.element]);
        break;

      // Delete element
      case 'ELEMENT_DELETE':
        setElements(prev => prev.filter(el => el.id !== event.element?.id));
        break;

      // Clear entire board
      case 'CLEAR':
        setElements([]);
        break;

      // Update cursor positions of other users
      case 'CURSOR_MOVE':
        if (event.userId !== user.id) {
          setRemoteUsers(prev => ({
            ...prev,
            [event.userId]: {
              ...prev[event.userId],
              name: event.userName,
              color: event.userColor,
              x: event.cursorX,
              y: event.cursorY
            }
          }));
        }
        break;

      // When a new user joins
      case 'USER_JOIN':
        if (event.userId !== user.id) {
          setRemoteUsers(prev => ({
            ...prev,
            [event.userId]: {
              name: event.userName,
              color: event.userColor,
              x: 0,
              y: 0
            }
          }));
          setConnected(true);
        }
        break;

      // When a user leaves
      case 'USER_LEAVE':
        setRemoteUsers(prev => {
          const updated = { ...prev };
          delete updated[event.userId];
          return updated;
        });
        break;

      default:
        break;
    }
  };

  // Handle incoming chat messages
  const handleChatEvent = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  // ================= WEBSOCKET CONNECTION =================

  const { sendDraw, sendCursor, sendChat, sendJoin, sendLeave } = useWebSocket({
    sessionId: session.id,
    onBoardEvent: handleBoardEvent,
    onChatEvent: handleChatEvent,
  });

  // Send join event after connection stabilizes
  useEffect(() => {
    const timer = setTimeout(() => {
      sendJoin({
        type: 'USER_JOIN',
        sessionId: session.id,
        userId: user.id,
        userName: user.name,
        userColor: user.color
      });
      setConnected(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // ================= AUTO SAVE =================

  // Save canvas data every 10 seconds
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      sessionAPI.updateElements(session.id, JSON.stringify(elements))
        .catch(() => {});
    }, 10000);

    return () => clearTimeout(saveTimerRef.current);
  }, [elements]);

  // ================= HANDLER FUNCTIONS =================

  // Add new drawing element
  const handleAddElement = (el) => {
    setElements(prev => [...prev, el]);

    sendDraw({
      type: 'ELEMENT_ADD',
      sessionId: session.id,
      userId: user.id,
      userName: user.name,
      userColor: user.color,
      element: el
    });
  };

  // Clear board
  const handleClear = () => {
    setElements([]);

    sendDraw({
      type: 'CLEAR',
      sessionId: session.id,
      userId: user.id,
      userName: user.name,
      userColor: user.color
    });
  };

  // Send cursor position
  const handleCursorMove = (x, y) => {
    sendCursor({
      type: 'CURSOR_MOVE',
      sessionId: session.id,
      userId: user.id,
      userName: user.name,
      userColor: user.color,
      cursorX: x,
      cursorY: y
    });
  };

  // Send chat message
  const handleSendChat = (content) => {
    sendChat({
      sessionId: session.id,
      senderId: user.id,
      senderName: user.name,
      senderColor: user.color,
      content
    });
  };

  // Leave session
  const handleLeave = () => {
    sendLeave({
      type: 'USER_LEAVE',
      sessionId: session.id,
      userId: user.id,
      userName: user.name,
      userColor: user.color
    });

    // Save before leaving
    sessionAPI.updateElements(session.id, JSON.stringify(elements)).catch(() => {});
    onLeave();
  };

  // Copy session ID to clipboard
  const copySessionId = () => {
    navigator.clipboard.writeText(session.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Combine current user + remote users
  const allUsers = [
    { id: user.id, name: user.name, color: user.color, isYou: true },
    ...Object.entries(remoteUsers).map(([id, u]) => ({
      id,
      ...u,
      isYou: false
    }))
  ];

  // ================= UI =================

  return (
    <div className="whiteboard-app">

      {/* Header Section */}
      <header className="whiteboard-header">

        {/* Left: App name + session info */}
        <div className="header-left">
          <div className="header-logo">CollabBoard</div>
          <div className="session-name">{session.name}</div>

          {/* Copy session ID button */}
          <button onClick={copySessionId}>
            {copied ? <><Check size={12}/> Copied!</> : <><Copy size={12}/> {session.id.slice(0,8)}…</>}
          </button>
        </div>

        {/* Center: Online users */}
        <div className="header-center">
          <Users size={14} /> {allUsers.length} online
        </div>

        {/* Right: Controls */}
        <div className="header-right">

          {/* Connection status */}
          <div className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? 'Live' : 'Connecting…'}
          </div>

          {/* Export */}
          <button onClick={() => setShowExport(true)}>
            <Download size={14}/> Export
          </button>

          {/* Toggle sidebar */}
          <button onClick={() => setSidebarOpen(o => !o)}>
            <PanelRight size={14}/>
          </button>

          {/* Leave session */}
          <button onClick={handleLeave}>
            <LogOut size={14}/> Leave
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="whiteboard-body">

        {/* Canvas Area */}
        <div className="canvas-container">

          {/* Background grid */}
          <div className="canvas-grid canvas-layer" style={{ pointerEvents:'none' }} />

          {/* Drawing Canvas */}
          <WhiteboardCanvas
            ref={canvasRef}
            elements={elements}
            tool={tool}
            color={color}
            strokeWidth={strokeWidth}
            user={user}
            remoteUsers={remoteUsers}
            onAddElement={handleAddElement}
            onCursorMove={handleCursorMove}
            onClear={handleClear}
          />

          {/* Toolbar */}
          <Toolbar
            tool={tool} setTool={setTool}
            color={color} setColor={setColor}
            strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth}
            onClear={handleClear}
          />
        </div>

        {/* Sidebar (chat + users) */}
        <Sidebar
          open={sidebarOpen}
          tab={sidebarTab}
          setTab={setSidebarTab}
          messages={messages}
          users={allUsers}
          currentUserId={user.id}
          onSendChat={handleSendChat}
        />
      </div>

      {/* Export Modal */}
      {showExport && (
        <ExportModal
          canvasRef={canvasRef}
          sessionName={session.name}
          elements={elements}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}