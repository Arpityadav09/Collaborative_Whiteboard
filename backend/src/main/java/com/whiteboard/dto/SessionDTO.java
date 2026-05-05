package com.whiteboard.dto;

import lombok.Data;

@Data
public class SessionDTO {
    private String name;
    private String ownerName;
    private String ownerId;
    private String password;
}