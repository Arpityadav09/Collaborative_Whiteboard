package com.whiteboard.service;

import com.whiteboard.dto.SessionDTO;
import com.whiteboard.model.WhiteboardSession;
import com.whiteboard.repository.WhiteboardSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final WhiteboardSessionRepository sessionRepository;

    // sessionId -> Set of userIds currently in that session
    private final Map<String, Set<String>> activeUsers = new ConcurrentHashMap<>();
    // sessionId -> Map of userId -> {name, color}
    private final Map<String, Map<String, Map<String, String>>> userDetails = new ConcurrentHashMap<>();

    public WhiteboardSession createSession(SessionDTO dto) {
        WhiteboardSession session = WhiteboardSession.builder()
                .id(UUID.randomUUID().toString())
                .name(dto.getName())
                .ownerName(dto.getOwnerName())
                .ownerId(dto.getOwnerId())
                .elementsJson("[]")
                .active(true)
                .password(dto.getPassword())
                .build();
        return sessionRepository.save(session);
    }

    public Optional<WhiteboardSession> getSession(String id) {
        return sessionRepository.findById(id);
    }

    public List<WhiteboardSession> getAllSessions() {
        return sessionRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<WhiteboardSession> getActiveSessions() {
        return sessionRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    public WhiteboardSession updateElements(String sessionId, String elementsJson) {
        WhiteboardSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        session.setElementsJson(elementsJson);
        return sessionRepository.save(session);
    }

    public WhiteboardSession toggleActive(String sessionId, boolean active) {
        WhiteboardSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found: " + sessionId));
        session.setActive(active);
        return sessionRepository.save(session);
    }

    public void deleteSession(String id) {
        sessionRepository.deleteById(id);
        activeUsers.remove(id);
        userDetails.remove(id);
    }

    public void addUser(String sessionId, String userId, String userName, String userColor) {
        activeUsers.computeIfAbsent(sessionId, k -> ConcurrentHashMap.newKeySet()).add(userId);
        userDetails.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                .put(userId, Map.of("name", userName, "color", userColor));
    }

    public void removeUser(String sessionId, String userId) {
        Set<String> users = activeUsers.get(sessionId);
        if (users != null) users.remove(userId);
        Map<String, Map<String, String>> details = userDetails.get(sessionId);
        if (details != null) details.remove(userId);
    }

    public int getActiveUserCount(String sessionId) {
        Set<String> users = activeUsers.get(sessionId);
        return users != null ? users.size() : 0;
    }

    public Map<String, Map<String, String>> getActiveUserDetails(String sessionId) {
        return userDetails.getOrDefault(sessionId, Collections.emptyMap());
    }

    public Map<String, Object> getAnalytics() {
        long totalSessions = sessionRepository.count();
        long activeSessions = sessionRepository.findByActiveTrueOrderByCreatedAtDesc().size();
        int totalActiveUsers = activeUsers.values().stream().mapToInt(Set::size).sum();
        return Map.of(
                "totalSessions", totalSessions,
                "activeSessions", activeSessions,
                "totalActiveUsers", totalActiveUsers
        );
    }
}