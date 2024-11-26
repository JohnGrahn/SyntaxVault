package com.syntaxvault.dto;

import lombok.Data;
import java.util.Set;

@Data
public class FolderDTO {
    private Long id;
    private String name;
    private Long parentId;
    private String username;
    private String path;
    private Set<Long> snippetIds;
    private Set<FolderDTO> subfolders;
} 