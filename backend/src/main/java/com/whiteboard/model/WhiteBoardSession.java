package com.whiteboard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "whiteboard_sessions")
public class WhiteboardSession {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    private String ownerName;
    private String ownerId;

    @Column(columnDefinition = "TEXT")
    private String elementsJson;

    private boolean active;
    private String password;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public WhiteboardSession() {}

    public WhiteboardSession(String id, String name, String ownerName, String ownerId,
                             String elementsJson, boolean active, String password,
                             LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id; this.name = name; this.ownerName = ownerName; this.ownerId = ownerId;
        this.elementsJson = elementsJson; this.active = active; this.password = password;
        this.createdAt = createdAt; this.updatedAt = updatedAt;
    }

    // Builder pattern
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id, name, ownerName, ownerId, elementsJson, password;
        private boolean active;
        private LocalDateTime createdAt, updatedAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder ownerName(String ownerName) { this.ownerName = ownerName; return this; }
        public Builder ownerId(String ownerId) { this.ownerId = ownerId; return this; }
        public Builder elementsJson(String elementsJson) { this.elementsJson = elementsJson; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public WhiteboardSession build() {
            return new WhiteboardSession(id, name, ownerName, ownerId, elementsJson, active, password, createdAt, updatedAt);
        }
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public String getElementsJson() { return elementsJson; }
    public void setElementsJson(String elementsJson) { this.elementsJson = elementsJson; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
