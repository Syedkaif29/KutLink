package com.kutlink.kutlink.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UrlShortenResponse {
    private String originalUrl;
    private String shortUrl;
    private String shortCode;
    private String qrCode;
}
