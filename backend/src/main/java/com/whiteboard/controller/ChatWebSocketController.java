package com.whiteboard.controller;

import com.whiteboard.dto.ChatMessageDTO;
import com.whiteboard.model.ChatMessage;
import com.whiteboard.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat")
    public void handleChatMessage(@Payload ChatMessageDTO dto) {
        // Persist message to DB
        ChatMessage saved = chatService.saveMessage(dto);

        // Build response payload
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", saved.getId());
        response.put("sessionId", saved.getSessionId());
        response.put("senderId", saved.getSenderId());
        response.put("senderName", saved.getSenderName());
        response.put("senderColor", saved.getSenderColor());
        response.put("content", saved.getContent());
        response.put("timestamp", saved.getTimestamp().toString());

        messagingTemplate.convertAndSend(
                "/topic/chat/" + dto.getSessionId(),
                response
        );
    }
}
