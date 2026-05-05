package com.whiteboard.service;

import com.whiteboard.dto.ChatMessageDTO;
import com.whiteboard.model.ChatMessage;
import com.whiteboard.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(ChatMessageDTO dto) {
        ChatMessage message = ChatMessage.builder()
                .sessionId(dto.getSessionId())
                .senderId(dto.getSenderId())
                .senderName(dto.getSenderName())
                .senderColor(dto.getSenderColor())
                .content(dto.getContent())
                .build();
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getMessages(String sessionId) {
        return chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }

    public long getMessageCount(String sessionId) {
        return chatMessageRepository.countBySessionId(sessionId);
    }
}
