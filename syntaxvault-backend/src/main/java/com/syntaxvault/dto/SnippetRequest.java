package com.syntaxvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;
import lombok.Data;

@Data
public class SnippetRequest {
    
    @NotBlank
    @Size(max = 255)
    private String title;
    
    private String description;
    
    @NotBlank
    private String content;
    
    @NotBlank
    @Size(max = 50)
    private String language;
    
    private Set<@Size(max = 50) String> tags;
}