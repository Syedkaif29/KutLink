package com.kutlink.kutlink.dto;

public class UrlShortenRequest {
    private String originalUrl;

    // Default constructor
    public UrlShortenRequest() {
    }

    // Constructor with parameters
    public UrlShortenRequest(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    // Getter method
    public String getOriginalUrl() {
        return originalUrl;
    }

    // Setter method
    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }
}