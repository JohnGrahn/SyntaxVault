package com.syntaxvault.dto;

import java.util.Set;
import lombok.Data;

@Data
public class CollectionDTO {
    private Long id;
    private String name;
    private String username; // Owner's username
    private Set<Long> snippetIds;
    private boolean isPublic;

    public boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
}