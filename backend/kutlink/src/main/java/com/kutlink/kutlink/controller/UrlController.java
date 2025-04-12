package com.kutlink.kutlink.controller;


import com.kutlink.kutlink.dto.UrlShortenRequest;
import com.kutlink.kutlink.dto.UrlShortenResponse;
import com.kutlink.kutlink.model.UrlEntity;
import com.kutlink.kutlink.service.QrCodeService;
import com.kutlink.kutlink.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class UrlController {

    private final UrlService urlService;
    private final QrCodeService qrCodeService;

    @Autowired
    public UrlController(UrlService urlService, QrCodeService qrCodeService) {
        this.urlService = urlService;
        this.qrCodeService = qrCodeService;
    }

    @PostMapping("/api/shorten")
    public ResponseEntity<UrlShortenResponse> shortenUrl(
            @RequestBody UrlShortenRequest request,
            HttpServletRequest servletRequest) {

        // Validate URL (basic validation)
        if (!request.getOriginalUrl().startsWith("http")) {
            request.setOriginalUrl("http://" + request.getOriginalUrl());
        }

        UrlEntity savedUrl = urlService.createShortUrl(request.getOriginalUrl());

        // Build short URL
        String baseUrl = getBaseUrl(servletRequest);
        String shortUrl = baseUrl + "/" + savedUrl.getShortCode();

        // Generate QR code
        String qrCodeBase64 = qrCodeService.generateQrCodeBase64(shortUrl);

        UrlShortenResponse response = new UrlShortenResponse(
                savedUrl.getOriginalUrl(),
                shortUrl,
                savedUrl.getShortCode(),
                qrCodeBase64
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{shortCode}")
    public RedirectView redirectToOriginalUrl(
            @PathVariable String shortCode) {

        Optional<UrlEntity> urlEntityOptional = urlService.getOriginalUrl(shortCode);

        if (urlEntityOptional.isPresent()) {
            return new RedirectView(urlEntityOptional.get().getOriginalUrl());
        } else {
            // Redirect to home page or error page if code not found
            return new RedirectView("/");
        }
    }

    private String getBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();

        StringBuilder url = new StringBuilder();
        url.append(scheme).append("://").append(serverName);

        if (serverPort != 80 && serverPort != 443) {
            url.append(":").append(serverPort);
        }

        return url.toString();
    }
}
