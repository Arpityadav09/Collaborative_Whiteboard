package com.whiteboard.repository;

import com.whiteboard.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySessionIdOrderByTimestampAsc(String sessionId);
    List<ChatMessage> findTop100BySessionIdOrderByTimestampDesc(String sessionId);
    long countBySessionId(String sessionId);
}
