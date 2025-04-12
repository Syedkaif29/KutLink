package com.kutlink.kutlink.service;

import com.kutlink.kutlink.model.UrlEntity;
import com.kutlink.kutlink.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int CODE_LENGTH = 6;
    private final Random random = new Random();

    @Autowired
    public UrlService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    public UrlEntity createShortUrl(String originalUrl) {
        // Generate a unique short code
        String shortCode = generateShortCode();

        // Create and save the URL entity
        UrlEntity urlEntity = new UrlEntity();
        urlEntity.setOriginalUrl(originalUrl);
        urlEntity.setShortCode(shortCode);

        return urlRepository.save(urlEntity);
    }

    public Optional<UrlEntity> getOriginalUrl(String shortCode) {
        return urlRepository.findByShortCode(shortCode);
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