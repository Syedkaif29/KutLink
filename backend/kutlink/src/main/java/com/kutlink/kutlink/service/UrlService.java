package com.kutlink.kutlink.service;

import com.kutlink.kutlink.model.UrlEntity;
import com.kutlink.kutlink.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private final QrCodeService qrCodeService;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int CODE_LENGTH = 6;
    private final Random random = new Random();

    @Autowired
    public UrlService(UrlRepository urlRepository, QrCodeService qrCodeService) {
        this.urlRepository = urlRepository;
        this.qrCodeService = qrCodeService;
    }

    public UrlEntity createShortUrl(String originalUrl, String baseUrl) {
        // Generate a unique short code
        String shortCode = generateShortCode();

        // Create the short URL
        String shortUrl = baseUrl + "/" + shortCode;

        // Generate QR code
        String qrCode = qrCodeService.generateQrCodeBase64(shortUrl);

        // Create and save the URL entity with QR code
        UrlEntity urlEntity = new UrlEntity();
        urlEntity.setOriginalUrl(originalUrl);
        urlEntity.setShortCode(shortCode);
        urlEntity.setQrCode(qrCode);
        urlEntity.setCreatedAt(LocalDateTime.now());

        return urlRepository.save(urlEntity);
    }

    public Optional<UrlEntity> getOriginalUrl(String shortCode) {
        return urlRepository.findByShortCode(shortCode);
    }

    public List<UrlEntity> getLinkHistory() {
        return urlRepository.findAllByOrderByCreatedAtDesc();
    }

    private String generateShortCode() {
        StringBuilder shortCode = new StringBuilder();
        for (int i = 0; i < CODE_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            shortCode.append(CHARACTERS.charAt(randomIndex));
        }

        // Check if the code already exists, if so, generate a new one
        if (urlRepository.findByShortCode(shortCode.toString()).isPresent()) {
            return generateShortCode(); // Recursively try again
        }

        return shortCode.toString();
    }
}