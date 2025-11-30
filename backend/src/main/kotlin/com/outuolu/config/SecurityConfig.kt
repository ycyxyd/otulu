package com.outuolu.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { } // Enable CORS
            .authorizeHttpRequests { auth ->
                // Public endpoints
                auth.requestMatchers("/api/v1/content/**").permitAll()
                auth.requestMatchers("/api/v1/location/**").permitAll()
                auth.requestMatchers("/api/v1/ai/**").permitAll() // For demo, maybe secure later
                
                // Secured endpoints
                auth.requestMatchers("/api/v1/community/**").authenticated()
                
                // Default
                auth.anyRequest().authenticated()
            }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt { }
            }
        
        return http.build()
    }
}
