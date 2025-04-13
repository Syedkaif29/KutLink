package com.kutlink.kutlink.controller;

import com.kutlink.kutlink.dto.UrlShortenRequest;
import com.kutlink.kutlink.dto.UrlShortenResponse;
import com.kutlink.kutlink.model.UrlEntity;
import com.kutlink.kutlink.service.QrCodeService;
import com.kutlink.kutlink.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UrlController {

    private final UrlService urlService;
    private final QrCodeService qrCodeService;
    private final String baseUrl;

    @Autowired
    public UrlController(UrlService urlService, QrCodeService qrCodeService,
            @Value("${app.base-url}") String baseUrl) {
        this.urlService = urlService;
        this.qrCodeService = qrCodeService;
        this.baseUrl = baseUrl;
    }

    @PostMapping("/shorten")
    public ResponseEntity<UrlShortenResponse> shortenUrl(@RequestBody UrlShortenRequest request) {
        // Validate the URL
        if (request.getOriginalUrl() == null || request.getOriginalUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Create short URL
        UrlEntity urlEntity = urlService.createShortUrl(request.getOriginalUrl(), baseUrl);

        // Create response
        UrlShortenResponse response = new UrlShortenResponse();
        response.setOriginalUrl(urlEntity.getOriginalUrl());
        response.setShortUrl(baseUrl + "/" + urlEntity.getShortCode());
        response.setShortCode(urlEntity.getShortCode());
        response.setQrCode(urlEntity.getQrCode());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<UrlShortenResponse>> getLinkHistory() {
        List<UrlEntity> urlEntities = urlService.getLinkHistory();

        List<UrlShortenResponse> responses = urlEntities.stream()
                .map(entity -> {
                    UrlShortenResponse response = new UrlShortenResponse();
                    response.setOriginalUrl(entity.getOriginalUrl());
                    response.setShortUrl(baseUrl + "/" + entity.getShortCode());
                    response.setShortCode(entity.getShortCode());
                    response.setQrCode(entity.getQrCode());
                    return response;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }
}
