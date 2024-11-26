package com.syntaxvault.mapper;

import com.syntaxvault.dto.FolderDTO;
import com.syntaxvault.model.Folder;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class FolderMapper {
    
    public FolderDTO toDTO(Folder folder) {
        if (folder == null) {
            return null;
        }

        FolderDTO dto = new FolderDTO();
        dto.setId(folder.getId());
        dto.setName(folder.getName());
        dto.setPath(folder.getPath());
        dto.setUsername(folder.getUser().getUsername());
        
        if (folder.getParent() != null) {
            dto.setParentId(folder.getParent().getId());
        }
        
        if (folder.getSnippets() != null) {
            dto.setSnippetIds(folder.getSnippets().stream()
                .map(snippet -> snippet.getId())
                .collect(Collectors.toSet()));
        }
        
        if (folder.getSubfolders() != null) {
            dto.setSubfolders(folder.getSubfolders().stream()
                .map(this::toDTO)
                .collect(Collectors.toSet()));
        }
        
        return dto;
    }
} 