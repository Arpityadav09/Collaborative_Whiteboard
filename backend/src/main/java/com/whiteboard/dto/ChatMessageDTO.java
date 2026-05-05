package com.whiteboard.dto;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private String sessionId;
    private String senderId;
    private String senderName;
    private String senderColor;
    private String content;
}
