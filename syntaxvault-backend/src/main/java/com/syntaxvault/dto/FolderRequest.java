package com.syntaxvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FolderRequest {
    @NotBlank
    @Size(max = 255)
    private String name;
    
    private Long parentId;
} 