package com.whiteboard.dto;

public class DrawEventDTO {
    private String type;
    private String sessionId;
    private String userId;
    private String userName;
    private String userColor;
    private Object element;
    private Double cursorX;
    private Double cursorY;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserColor() { return userColor; }
    public void setUserColor(String userColor) { this.userColor = userColor; }
    public Object getElement() { return element; }
    public void setElement(Object element) { this.element = element; }
    public Double getCursorX() { return cursorX; }
    public void setCursorX(Double cursorX) { this.cursorX = cursorX; }
    public Double getCursorY() { return cursorY; }
    public void setCursorY(Double cursorY) { this.cursorY = cursorY; }
}
