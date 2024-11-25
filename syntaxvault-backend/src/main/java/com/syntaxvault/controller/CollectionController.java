package com.syntaxvault.controller;

import com.syntaxvault.dto.CollectionDTO;
import com.syntaxvault.dto.CollectionRequest;
import com.syntaxvault.service.CollectionService;
import com.syntaxvault.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {
    
    @Autowired
    private CollectionService collectionService;

    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CollectionDTO> createCollection(@RequestBody CollectionRequest collectionRequest){
        CollectionDTO createdCollectionDTO = collectionService.createCollection(collectionRequest);
        return ResponseEntity.ok(createdCollectionDTO);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CollectionDTO> getCollectionById(@PathVariable Long id){
        Optional<CollectionDTO> collectionDTOOpt = collectionService.getCollectionByIdDTO(id);
        return collectionDTOOpt.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<CollectionDTO>> getAllCollections(){
        List<CollectionDTO> collectionDTOs = collectionService.getAllCollectionsDTO();
        return ResponseEntity.ok(collectionDTOs);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<CollectionDTO> updateCollection(@PathVariable Long id, @RequestBody CollectionRequest collectionRequest){
        CollectionDTO updatedCollectionDTO = collectionService.updateCollection(id, collectionRequest);
        return ResponseEntity.ok(updatedCollectionDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id){
        collectionService.deleteCollection(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public")
    public ResponseEntity<List<CollectionDTO>> getPublicCollections() {
        List<CollectionDTO> publicCollections = collectionService.getPublicCollections();
        return ResponseEntity.ok(publicCollections);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<CollectionDTO> getPublicCollectionById(@PathVariable Long id) {
        Optional<CollectionDTO> collectionDTO = collectionService.getPublicCollectionById(id);
        return collectionDTO.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }
}