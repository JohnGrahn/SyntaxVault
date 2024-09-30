package com.syntaxvault.controller;

import com.syntaxvault.model.Collection;
import com.syntaxvault.dto.CollectionRequest;
import com.syntaxvault.service.CollectionService;
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

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Collection> createCollection(@RequestBody CollectionRequest collectionRequest){
        Collection createdCollection = collectionService.createCollection(collectionRequest);
        return ResponseEntity.ok(createdCollection);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Collection> getCollectionById(@PathVariable Long id){
        Optional<Collection> collection = collectionService.getCollectionById(id);
        return collection.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Collection>> getAllCollections(){
        List<Collection> collections = collectionService.getAllCollections();
        return ResponseEntity.ok(collections);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Collection> updateCollection(@PathVariable Long id, @RequestBody CollectionRequest collectionRequest){
        Collection updatedCollection = collectionService.updateCollection(id, collectionRequest);
        return ResponseEntity.ok(updatedCollection);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id){
        collectionService.deleteCollection(id);
        return ResponseEntity.noContent().build();
    }
}