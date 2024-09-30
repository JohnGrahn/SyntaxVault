package com.syntaxvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;
import lombok.Data;

@Data
public class CollectionRequest {
    
    @NotBlank
    @Size(max = 255)
    private String name;
    
    // Optionally include snippet IDs to associate with the collection
    private Set<Long> snippetIds;
}