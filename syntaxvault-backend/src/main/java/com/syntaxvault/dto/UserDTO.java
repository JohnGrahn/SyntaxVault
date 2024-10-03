// src/main/java/com/syntaxvault/dto/UserDTO.java
package com.syntaxvault.dto;

import java.time.LocalDateTime;
import java.util.Set;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<String> roles;
}