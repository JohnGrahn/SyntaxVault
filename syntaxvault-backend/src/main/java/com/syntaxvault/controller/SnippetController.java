package com.syntaxvault.controller;

import com.syntaxvault.dto.SnippetDTO;
import com.syntaxvault.dto.SnippetRequest;
import com.syntaxvault.model.User;
import com.syntaxvault.service.SnippetService;
import com.syntaxvault.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import java.util.Optional;
import com.syntaxvault.mapper.SnippetMapper;
import java.util.Map;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {
    
    @Autowired
    private SnippetService snippetService;

    @Autowired
    private UserService userService;

    @Autowired
    private SnippetMapper snippetMapper;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<SnippetDTO> createSnippet(@RequestBody SnippetRequest snippetRequest, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        SnippetDTO createdSnippetDTO = snippetService.createSnippet(snippetRequest, user);
        return ResponseEntity.ok(createdSnippetDTO);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<SnippetDTO> getSnippetById(@PathVariable Long id){
        Optional<SnippetDTO> snippetDTOOpt = snippetService.getSnippetByIdDTO(id);
        return snippetDTOOpt.map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<SnippetDTO>> getAllSnippets(){
        List<SnippetDTO> snippetDTOs = snippetService.getAllSnippetsDTO();
        return ResponseEntity.ok(snippetDTOs);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<SnippetDTO> updateSnippet(@PathVariable Long id, @RequestBody SnippetRequest snippetRequest, Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("Controller received isPublic value: " + snippetRequest.isPublic());
        SnippetDTO updatedSnippetDTO = snippetService.updateSnippet(id, snippetRequest, user);
        return ResponseEntity.ok(updatedSnippetDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSnippet(@PathVariable Long id){
        snippetService.deleteSnippet(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<SnippetDTO>> searchSnippets(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) List<String> tags) { // Changed to List<String>
        List<SnippetDTO> snippetDTOs = snippetService.searchSnippets(keyword, language, tags);
        return ResponseEntity.ok(snippetDTOs);
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<SnippetDTO>> getUserSnippets(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<SnippetDTO> snippetDTOs = snippetService.getSnippetsByUserDTO(user);
        return ResponseEntity.ok(snippetDTOs);
    }

    // Additional endpoints (e.g., search) can be added here

    // Utility method to convert Collection to CollectionDTO can be added here if needed

    @GetMapping("/public")
    public ResponseEntity<List<SnippetDTO>> getPublicSnippets() {
        List<SnippetDTO> publicSnippets = snippetService.getPublicSnippets();
        return ResponseEntity.ok(publicSnippets);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<SnippetDTO> getPublicSnippetById(@PathVariable Long id) {
        Optional<SnippetDTO> snippetDTO = snippetService.getPublicSnippetById(id);
        return snippetDTO.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/move")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<SnippetDTO> moveSnippet(
        @PathVariable Long id,
        @RequestBody Map<String, Long> request,
        Authentication authentication) {
        
        String username = authentication.getName();
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long folderId = request.get("folderId");
        SnippetDTO movedSnippet = snippetService.moveSnippet(id, folderId, user);
        return ResponseEntity.ok(movedSnippet);
    }

    @GetMapping("/folder/{folderId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<SnippetDTO>> getSnippetsByFolder(
        @PathVariable Long folderId,
        Authentication authentication) {
        
        String username = authentication.getName();
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<SnippetDTO> snippets = snippetService.getSnippetsByFolder(folderId, user);
        return ResponseEntity.ok(snippets);
    }
}
