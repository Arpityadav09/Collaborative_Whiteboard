package com.whiteboard.controller;

import com.whiteboard.dto.DrawEventDTO;
import com.whiteboard.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WhiteboardWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final SessionService sessionService;

    @MessageMapping("/draw")
    public void handleDrawEvent(@Payload DrawEventDTO event) {
        // Broadcast to all subscribers of this session's board topic
        messagingTemplate.convertAndSend(
                "/topic/board/" + event.getSessionId(),
                event
        );
    }

    @MessageMapping("/cursor")
    public void handleCursorMove(@Payload DrawEventDTO event) {
        messagingTemplate.convertAndSend(
                "/topic/board/" + event.getSessionId(),
                event
        );
    }

    @MessageMapping("/join")
    public void handleUserJoin(@Payload DrawEventDTO event) {
        sessionService.addUser(
                event.getSessionId(),
                event.getUserId(),
                event.getUserName(),
                event.getUserColor()
        );
        // Broadcast join event so all clients update their user list
        messagingTemplate.convertAndSend(
                "/topic/board/" + event.getSessionId(),
                event
        );
    }

    @MessageMapping("/leave")
    public void handleUserLeave(@Payload DrawEventDTO event) {
        sessionService.removeUser(event.getSessionId(), event.getUserId());
        messagingTemplate.convertAndSend(
                "/topic/board/" + event.getSessionId(),
                event
        );
    }
}