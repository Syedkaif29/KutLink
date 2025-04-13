package com.kutlink.kutlink.controller;

import com.kutlink.kutlink.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class RedirectController {

  private final UrlService urlService;

  @Autowired
  public RedirectController(UrlService urlService) {
    this.urlService = urlService;
  }

  @GetMapping("/{shortCode}")
  public RedirectView redirectToOriginalUrl(@PathVariable String shortCode) {
    return urlService.getOriginalUrl(shortCode)
        .map(entity -> {
          RedirectView redirectView = new RedirectView();
          redirectView.setUrl(entity.getOriginalUrl());
          redirectView.setStatusCode(HttpStatus.FOUND); // 302 Found
          return redirectView;
        })
        .orElse(new RedirectView("/error"));
  }
}