package com.syntaxvault.dto;

import java.time.LocalDateTime;
import java.util.Set;
import lombok.Data;

@Data
public class SnippetDTO {
    private Long id;
    private String title;
    private String description;
    private String content;
    private String language;
    private LocalDateTime creationDate;
    private LocalDateTime lastModifiedDate;
    private String username; // Owner's username
    private Set<TagDTO> tags;
}