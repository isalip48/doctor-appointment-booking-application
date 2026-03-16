package com.appointment.booking.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS Configuration
 * 
 * WHY: Allows frontend (on different domain) to call backend API
 * WITHOUT THIS: Browser blocks API requests due to security policy
 */
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow requests from these origins (domains)
        config.setAllowedOrigins(Arrays.asList(
            "https://docsync-frontend.vercel.app",         // Production Vercel
            "https://docsync-frontend-*.vercel.app",       // Vercel preview deployments (won't work with wildcard, but we'll fix later)
            "http://localhost:8081",                        // Local Expo development
            "http://localhost:19006",                       // Local Expo Web
            "http://localhost:19000"                        // Alternative Expo port
        ));
        
        // Allow these HTTP methods
        config.setAllowedMethods(Arrays.asList(
            "GET",      // Read data
            "POST",     // Create data
            "PUT",      // Update data
            "DELETE",   // Delete data
            "OPTIONS"   // Preflight requests (browser checks)
        ));
        
        // Allow all headers (Authorization, Content-Type, etc.)
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials (cookies, auth tokens)
        config.setAllowCredentials(true);
        
        // Cache preflight response for 1 hour
        config.setMaxAge(3600L);
        
        // Apply this configuration to ALL endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}