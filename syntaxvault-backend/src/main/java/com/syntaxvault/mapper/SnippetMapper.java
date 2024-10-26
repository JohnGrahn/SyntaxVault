// src/main/java/com/syntaxvault/mapper/SnippetMapper.java
package com.syntaxvault.mapper;

import com.syntaxvault.dto.SnippetDTO;
import com.syntaxvault.model.Snippet;
import com.syntaxvault.model.Tag;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class SnippetMapper {
    
    @Autowired
    private TagMapper tagMapper;
    
    public SnippetMapper(TagMapper tagMapper) {
        this.tagMapper = tagMapper;
    }

    public SnippetDTO toDTO(Snippet snippet) {
        SnippetDTO dto = new SnippetDTO();
        dto.setId(snippet.getId());
        dto.setTitle(snippet.getTitle());
        dto.setDescription(snippet.getDescription());
        dto.setContent(snippet.getContent());
        dto.setLanguage(snippet.getLanguage());
        dto.setCreationDate(snippet.getCreationDate());
        dto.setLastModifiedDate(snippet.getLastModifiedDate());
        dto.setPublic(snippet.getIsPublic());  // Ensure correct method
        
        // Handle the case where the user might not be initialized
        if (snippet.getUser() != null && snippet.getUser().getUsername() != null) {
            dto.setUsername(snippet.getUser().getUsername());
        }
        
        if (snippet.getTags() != null) {
            dto.setTags(snippet.getTags().stream()
                .map(tagMapper::toDTO)
                .collect(Collectors.toSet()));
        }
        
        return dto;
    }

    // Existing methods...
}
