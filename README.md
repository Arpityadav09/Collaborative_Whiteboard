🧑‍🎨 Collaborative Whiteboard
A real-time collaborative whiteboard application that enables multiple users to draw, write, and brainstorm together seamlessly from anywhere.

🚀 Overview
With the rise of remote work and online collaboration, traditional tools fall short in providing real-time interaction. This project solves that by offering a low-latency, multi-user whiteboard platform where users can collaborate visually and interactively.

✨ Features
🎯 Core Features
🖊️ Real-time drawing & sketching (multi-user)

🧩 Tools: Pen, eraser, shapes, text, sticky notes

🔗 Create & join sessions via unique links

💬 Live chat & comments during collaboration

💾 Save and load whiteboards

📤 Export whiteboard as Image / PDF

👥 User Roles
User

Join/create sessions

Draw, annotate, chat

Admin/Moderator

Manage permissions

Control editing rights

Monitor activity

🏗️ Architecture
Frontend (React / Next.js)
        ↓
WebSocket (STOMP / SockJS)
        ↓
Backend (Spring Boot)
   ├── Session Service
   ├── Collaboration Engine
   ├── Chat Service
   ├── Export Service
        ↓
PostgreSQL (Data Storage)
Redis (Real-time Sync)
Cloud Storage (AWS S3)
⚙️ Tech Stack
🎨 Frontend
React.js / Next.js

HTML5 Canvas (Fabric.js / Konva.js)

Tailwind CSS

⚡ Backend
Java + Spring Boot

WebSockets (STOMP, SockJS)

REST APIs

🧠 Real-Time & Caching
Redis (Pub/Sub messaging)

🗄️ Database
PostgreSQL / MySQL

☁️ Storage
AWS S3 / Cloud Storage

🔁 How Real-Time Collaboration Works
User draws on canvas

Stroke data is converted to JSON

Sent via WebSocket to server

Server broadcasts to all participants

Other users see updates instantly

Example Event
{
  "type": "DRAW",
  "userId": "U123",
  "color": "#000",
  "strokeWidth": 3,
  "points": [[10,10],[20,20],[30,40]]
}
📂 Project Structure
/frontend
  ├── components
  ├── pages
  ├── canvas
/backend
  ├── controllers
  ├── services
  ├── models
  ├── websocket
/database
  ├── schema.sql
🔐 Authentication & Security
JWT-based authentication

Role-based access control

Secure session handling

📊 Database Schema (Simplified)
Users
id | name | email | role
Sessions
id | owner_id | created_at
Whiteboard Data
id | session_id | json_data
Messages
id | session_id | user_id | message
📡 API Endpoints
Session APIs
POST /session/create
GET  /session/{id}
POST /session/join
WebSocket Topics
/topic/draw/{sessionId}
/topic/chat/{sessionId}
⚡ Performance Optimizations
Event-based updates (not full canvas)

Throttling drawing events

Redis Pub/Sub for fast sync

Optimistic UI rendering

🌟 Future Enhancements
🧠 AI shape recognition

🎥 Whiteboard playback (history replay)

🧑‍🤝‍🧑 Live cursor tracking

📌 Advanced sticky board mode

🎙️ Voice notes integration

🧪 How to Run
🔧 Backend
cd backend
mvn spring-boot:run
🎨 Frontend
cd frontend
npm install
npm run dev
🏁 Hackathon Deliverables
✅ Real-time collaboration

✅ Drawing tools & chat

✅ Save/load/export functionality

✅ Scalable architecture

✅ Clean UI/UX

🏆 Judging Criteria Alignment
Category	Implementation
UX/UI	Clean, intuitive canvas
Real-Time	WebSocket + Redis
Scalability	Modular backend
Features	Drawing + Chat + Export
Innovation	Smart tools & playback
🤝 Contributing
Contributions are welcome!
Feel free to fork the repo and submit a pull request.

📜 License
This project is licensed under the MIT License.

💡 Inspiration
Built to empower teams, students, and creators to collaborate visually in real-time—anytime, anywhere.
