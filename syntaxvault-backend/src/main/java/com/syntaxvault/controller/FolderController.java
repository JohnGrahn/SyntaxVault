package com.syntaxvault.controller;

import com.syntaxvault.dto.FolderDTO;
import com.syntaxvault.dto.FolderRequest;
import com.syntaxvault.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    
    @Autowired
    private FolderService folderService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FolderDTO> createFolder(@RequestBody FolderRequest folderRequest) {
        FolderDTO createdFolder = folderService.createFolder(folderRequest);
        return ResponseEntity.ok(createdFolder);
    }

    @GetMapping("/root")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FolderDTO>> getRootFolders() {
        List<FolderDTO> rootFolders = folderService.getRootFolders();
        return ResponseEntity.ok(rootFolders);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FolderDTO> getFolderById(@PathVariable Long id) {
        return folderService.getFolderById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FolderDTO> updateFolder(@PathVariable Long id, @RequestBody FolderRequest folderRequest) {
        FolderDTO updatedFolder = folderService.updateFolder(id, folderRequest);
        return ResponseEntity.ok(updatedFolder);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long id) {
        folderService.deleteFolder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FolderDTO>> getAllFolders() {
        List<FolderDTO> folders = folderService.getAllFolders();
        return ResponseEntity.ok(folders);
    }
} 