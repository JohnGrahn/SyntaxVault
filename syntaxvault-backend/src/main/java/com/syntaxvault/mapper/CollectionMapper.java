package com.syntaxvault.mapper;

import com.syntaxvault.dto.CollectionDTO;
import com.syntaxvault.model.Collection;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CollectionMapper {

    public CollectionDTO toDTO(Collection collection) {
        CollectionDTO dto = new CollectionDTO();
        dto.setId(collection.getId());
        dto.setName(collection.getName());
        
        // Ensure that the user is fetched (already handled in service with JOIN FETCH)
        dto.setUsername(collection.getUser().getUsername());
        
        // Map snippet IDs
        if (collection.getSnippets() != null) {
            dto.setSnippetIds(collection.getSnippets().stream()
                                     .map(snippet -> snippet.getId())
                                     .collect(Collectors.toSet()));
        }
        
        return dto;
    }

    // If needed, add methods to map from DTO to Entity
    // public Collection toEntity(CollectionDTO dto) {
    //     // Implementation here
    // }
}
