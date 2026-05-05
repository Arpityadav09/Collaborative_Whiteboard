package com.whiteboard.repository;

import com.whiteboard.model.WhiteboardSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WhiteboardSessionRepository extends JpaRepository<WhiteboardSession, String> {
    List<WhiteboardSession> findByActiveTrueOrderByCreatedAtDesc();
    List<WhiteboardSession> findAllByOrderByCreatedAtDesc();
}
