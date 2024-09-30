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
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {
    
    @Autowired
    private SnippetService snippetService;

    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Snippet> createSnippet(@RequestBody SnippetRequest snippetRequest, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Snippet createdSnippet = snippetService.createSnippet(snippetRequest, user);
        return ResponseEntity.ok(createdSnippet);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Snippet> getSnippetById(@PathVariable Long id){
        Optional<Snippet> snippet = snippetService.getSnippetById(id);
        return snippet.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Snippet>> getAllSnippets(){
        List<Snippet> snippets = snippetService.getAllSnippets();
        return ResponseEntity.ok(snippets);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Snippet> updateSnippet(@PathVariable Long id, @RequestBody SnippetRequest snippetRequest, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Snippet updatedSnippet = snippetService.updateSnippet(id, snippetRequest, user);
        return ResponseEntity.ok(updatedSnippet);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSnippet(@PathVariable Long id){
        snippetService.deleteSnippet(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Snippet>> searchSnippets(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) Set<String> tags) {
        List<Snippet> snippets = snippetService.searchSnippets(keyword, language, tags);
        return ResponseEntity.ok(snippets);
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Snippet>> getUserSnippets(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Snippet> snippets = snippetService.getSnippetsByUser(user);
        return ResponseEntity.ok(snippets);
    }

    // Additional endpoints (e.g., search) can be added here
}