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

@Service
public class CollectionService {
    
    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private SnippetRepository snippetRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Collection createCollection(CollectionRequest collectionRequest) {
        // Retrieve the authenticated user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                      .orElseThrow(() -> new RuntimeException("User not found"));

        Collection collection = new Collection();
        collection.setName(collectionRequest.getName());
        collection.setUser(user);

        if (collectionRequest.getSnippetIds() != null) {
            Set<Snippet> snippets = collectionRequest.getSnippetIds().stream()
                                        .map(id -> snippetRepository.findById(id)
                                            .orElseThrow(() -> new RuntimeException("Snippet not found")))
                                        .collect(Collectors.toSet());
            collection.setSnippets(snippets);
        }

        return collectionRepository.save(collection);
    }

    public Optional<Collection> getCollectionById(Long id){
        return collectionRepository.findById(id);
    }

    public List<Collection> getAllCollections(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return collectionRepository.findByUserUsername(username);
    }

    @Transactional
    public Collection updateCollection(Long id, CollectionRequest collectionRequest){
        Collection collection = collectionRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Collection not found"));

        collection.setName(collectionRequest.getName());

        if (collectionRequest.getSnippetIds() != null) {
            Set<Snippet> snippets = collectionRequest.getSnippetIds().stream()
                                        .map(snippetRepository::findById)
                                        .filter(Optional::isPresent)
                                        .map(Optional::get)
                                        .collect(Collectors.toSet());
            collection.setSnippets(snippets);
        }

        return collectionRepository.save(collection);
    }

    @Transactional
    public void deleteCollection(Long id){
        collectionRepository.deleteById(id);
    }
}