package com.syntaxvault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    
    @JsonProperty("isPublic")
    private boolean isPublic = false;
    
    public boolean isPublic() {
        return isPublic;
    }
    
    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
}
