package com.whiteboard.controller;

import com.whiteboard.dto.SessionDTO;
import com.whiteboard.model.WhiteboardSession;
import com.whiteboard.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping
    public ResponseEntity<WhiteboardSession> createSession(@RequestBody SessionDTO dto) {
        return ResponseEntity.ok(sessionService.createSession(dto));
    }

    @GetMapping
    public ResponseEntity<List<WhiteboardSession>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/active")
    public ResponseEntity<List<WhiteboardSession>> getActiveSessions() {
        return ResponseEntity.ok(sessionService.getActiveSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WhiteboardSession> getSession(@PathVariable String id) {
        return sessionService.getSession(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/elements")
    public ResponseEntity<WhiteboardSession> updateElements(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(sessionService.updateElements(id, body.get("elementsJson")));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<WhiteboardSession> toggleSession(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(sessionService.toggleActive(id, body.getOrDefault("active", true)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable String id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/users")
    public ResponseEntity<Map<String, Object>> getSessionUsers(@PathVariable String id) {
        return ResponseEntity.ok(Map.of(
                "count", sessionService.getActiveUserCount(id),
                "users", sessionService.getActiveUserDetails(id)
        ));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(sessionService.getAnalytics());
    }
}