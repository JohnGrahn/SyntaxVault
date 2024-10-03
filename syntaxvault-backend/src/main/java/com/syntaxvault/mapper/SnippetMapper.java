// src/main/java/com/syntaxvault/mapper/SnippetMapper.java
package com.syntaxvault.mapper;

import com.syntaxvault.dto.SnippetDTO;
import com.syntaxvault.model.Snippet;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class SnippetMapper {
    
    public SnippetDTO toDTO(Snippet snippet) {
        SnippetDTO dto = new SnippetDTO();
        dto.setId(snippet.getId());
        dto.setTitle(snippet.getTitle());
        dto.setDescription(snippet.getDescription());
        dto.setContent(snippet.getContent());
        dto.setLanguage(snippet.getLanguage());
        dto.setCreationDate(snippet.getCreationDate());
        dto.setLastModifiedDate(snippet.getLastModifiedDate());
        dto.setUsername(snippet.getUser().getUsername());
        // Only map tags if they are already loaded
        if (snippet.getTags() != null) {
            dto.setTags(snippet.getTags().stream()
                .map(tag -> tag.getName())
                .collect(Collectors.toSet()));
        }
        return dto;
    }
}