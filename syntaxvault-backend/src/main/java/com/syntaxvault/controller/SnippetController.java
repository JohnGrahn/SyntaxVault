package com.syntaxvault.controller;

import com.syntaxvault.model.Snippet;
import com.syntaxvault.service.SnippetService;
import com.syntaxvault.dto.SnippetRequest;
import com.syntaxvault.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
//import java.util.Set;
import java.time.LocalDateTime;
import com.syntaxvault.service.UserService;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {
    
    @Autowired
    private SnippetService snippetService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Snippet> createSnippet(@RequestBody SnippetRequest snippetRequest, Authentication authentication){
        // Retrieve the authenticated user
        String username = authentication.getName();
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create Snippet entity
        Snippet snippet = new Snippet();
        snippet.setTitle(snippetRequest.getTitle());
        snippet.setDescription(snippetRequest.getDescription());
        snippet.setContent(snippetRequest.getContent());
        snippet.setLanguage(snippetRequest.getLanguage());
        snippet.setCreationDate(LocalDateTime.now());
        snippet.setLastModifiedDate(LocalDateTime.now());

        // Create snippet with tags
        Snippet createdSnippet = snippetService.createSnippet(snippet, snippetRequest.getTags(), user);
        return ResponseEntity.ok(createdSnippet);
    }

    // Additional CRUD endpoints for snippets
}