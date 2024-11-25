package com.syntaxvault.service;

import com.syntaxvault.model.Collection;
import com.syntaxvault.model.Snippet;
import com.syntaxvault.dto.CollectionRequest;
import com.syntaxvault.repository.CollectionRepository;
import com.syntaxvault.repository.SnippetRepository;
import com.syntaxvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import com.syntaxvault.model.User;
import java.util.Set;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.syntaxvault.dto.CollectionDTO;
import com.syntaxvault.mapper.CollectionMapper;

@Service
public class CollectionService {
    
    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private SnippetRepository snippetRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CollectionMapper collectionMapper; // Assume you have a mapper

    @Transactional
    public CollectionDTO createCollection(CollectionRequest collectionRequest) {
        // Retrieve the authenticated user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                      .orElseThrow(() -> new RuntimeException("User not found"));

        Collection collection = new Collection();
        collection.setName(collectionRequest.getName());
        collection.setUser(user);
        collection.setIsPublic(collectionRequest.getIsPublic());

        if (collectionRequest.getSnippetIds() != null) {
            Set<Snippet> snippets = collectionRequest.getSnippetIds().stream()
                                        .map(id -> snippetRepository.findById(id)
                                            .orElseThrow(() -> new RuntimeException("Snippet not found")))
                                        .filter(snippet -> !collection.getIsPublic() || snippet.getIsPublic()) // Only allow public snippets in public collections
                                        .collect(Collectors.toSet());
            collection.setSnippets(snippets);
        }

        Collection savedCollection = collectionRepository.save(collection);
        return collectionMapper.toDTO(savedCollection);
    }

    public Optional<CollectionDTO> getCollectionByIdDTO(Long id){
        Optional<Collection> collectionOpt = Optional.ofNullable(collectionRepository.findByIdWithUserAndSnippets(id));
        return collectionOpt.map(collectionMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<CollectionDTO> getAllCollectionsDTO(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Collection> collections = collectionRepository.findByUserUsername(username);
        return collections.stream()
                          .map(collectionMapper::toDTO)
                          .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CollectionDTO> getPublicCollections() {
        List<Collection> collections = collectionRepository.findByIsPublicTrue();
        return collections.stream()
                         .map(collectionMapper::toDTO)
                         .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CollectionDTO> getPublicCollectionById(Long id) {
        Optional<Collection> collection = collectionRepository.findByIdAndIsPublicTrue(id);
        return collection.map(collectionMapper::toDTO);
    }

    @Transactional
    public CollectionDTO updateCollection(Long id, CollectionRequest collectionRequest){
        Collection collection = collectionRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Collection not found"));

        collection.setName(collectionRequest.getName());
        collection.setIsPublic(collectionRequest.getIsPublic());

        if (collectionRequest.getSnippetIds() != null) {
            Set<Snippet> snippets = collectionRequest.getSnippetIds().stream()
                                        .map(snippetId -> snippetRepository.findById(snippetId)
                                            .orElseThrow(() -> new RuntimeException("Snippet not found")))
                                        .filter(snippet -> !collection.getIsPublic() || snippet.getIsPublic()) // Only allow public snippets in public collections
                                        .collect(Collectors.toSet());
            collection.setSnippets(snippets);
        }

        Collection updatedCollection = collectionRepository.save(collection);
        return collectionMapper.toDTO(updatedCollection);
    }

    @Transactional
    public void deleteCollection(Long id){
        collectionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public CollectionDTO getCollectionByIdWithUserAndSnippetsDTO(Long id) {
        Collection collection = collectionRepository.findByIdWithUserAndSnippets(id);
        if(collection == null){
            return null;
        }
        return collectionMapper.toDTO(collection);
    }
}