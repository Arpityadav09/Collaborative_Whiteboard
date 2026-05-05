package com.whiteboard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sessionId;

    private String senderId;
    private String senderName;
    private String senderColor;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    // Constructors
    public ChatMessage() {}

    public ChatMessage(Long id, String sessionId, String senderId, String senderName,
                       String senderColor, String content, LocalDateTime timestamp) {
        this.id = id; this.sessionId = sessionId; this.senderId = senderId;
        this.senderName = senderName; this.senderColor = senderColor;
        this.content = content; this.timestamp = timestamp;
    }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String sessionId, senderId, senderName, senderColor, content;
        private LocalDateTime timestamp;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder sessionId(String sessionId) { this.sessionId = sessionId; return this; }
        public Builder senderId(String senderId) { this.senderId = senderId; return this; }
        public Builder senderName(String senderName) { this.senderName = senderName; return this; }
        public Builder senderColor(String senderColor) { this.senderColor = senderColor; return this; }
        public Builder content(String content) { this.content = content; return this; }
        public ChatMessage build() {
            return new ChatMessage(id, sessionId, senderId, senderName, senderColor, content, timestamp);
        }
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getSenderColor() { return senderColor; }
    public void setSenderColor(String senderColor) { this.senderColor = senderColor; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
