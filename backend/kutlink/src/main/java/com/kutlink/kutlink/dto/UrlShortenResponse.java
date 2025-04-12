package com.kutlink.kutlink.dto;

public class UrlShortenResponse {
    private String originalUrl;
    private String shortUrl;
    private String shortCode;
    private String qrCode;

    // Default constructor
    public UrlShortenResponse() {
    }

    // Constructor with all parameters
    public UrlShortenResponse(String originalUrl, String shortUrl, String shortCode, String qrCode) {
        this.originalUrl = originalUrl;
        this.shortUrl = shortUrl;
        this.shortCode = shortCode;
        this.qrCode = qrCode;
    }

    // Getters and setters
    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public void setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
    }

    public String getShortCode() {
        return shortCode;
    }

    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }
}
