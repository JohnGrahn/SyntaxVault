package com.syntaxvault.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.*;

@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI syntaxVaultOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("SyntaxVault API")
                .description("API documentation for SyntaxVault Code Snippet Manager")
                .version("v1.0"));
    }
}