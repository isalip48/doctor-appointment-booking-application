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
            // Vercel Production Domains (YOUR ACTUAL DOMAINS)
            "https://doctor-appointment-booking-applicat-gamma.vercel.app",
            "https://doctor-appointment-booking-applic-git-f7086b-isalip48s-projects.vercel.app",
            "https://doctor-appointment-booking-application-5giuuj4tf.vercel.app",
            
            // Local Development
            "http://localhost:8081",
            "http://localhost:19006",
            "http://localhost:19000"
        ));
        
        // Allow these HTTP methods
        config.setAllowedMethods(Arrays.asList(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ));
        
        // Allow all headers
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