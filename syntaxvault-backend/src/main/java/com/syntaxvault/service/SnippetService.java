package com.syntaxvault.service;

import com.syntaxvault.model.Snippet;
import com.syntaxvault.model.Tag;
import com.syntaxvault.model.User;
import com.syntaxvault.dto.SnippetRequest;
import com.syntaxvault.repository.SnippetRepository;
import com.syntaxvault.repository.TagRepository;
import com.syntaxvault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import org.springframework.data.jpa.domain.Specification;
import com.syntaxvault.specification.SnippetSpecification;

@Service
public class SnippetService {
    
    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private TagRepository tagRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Snippet createSnippet(SnippetRequest snippetRequest, User user) {
        Snippet snippet = new Snippet();
        snippet.setTitle(snippetRequest.getTitle());
        snippet.setDescription(snippetRequest.getDescription());
        snippet.setContent(snippetRequest.getContent());
        snippet.setLanguage(snippetRequest.getLanguage());
        snippet.setCreationDate(LocalDateTime.now());
        snippet.setLastModifiedDate(LocalDateTime.now());
        snippet.setUser(user);

        // Handle tags
        Set<Tag> tags = new HashSet<>();
        for (String tagName : snippetRequest.getTags()) {
            Tag tag = tagRepository.findByName(tagName)
                .orElseGet(() -> tagRepository.save(new Tag(tagName)));
            tags.add(tag);
        }
        snippet.setTags(tags);
        
        return snippetRepository.save(snippet);
    }

    public Optional<Snippet> getSnippetById(Long id){
        return snippetRepository.findById(id);
    }

    public List<Snippet> getAllSnippets(){
        return snippetRepository.findAll();
    }

    @Transactional
    public Snippet updateSnippet(Long id, SnippetRequest snippetRequest, User user) {
        Snippet snippet = snippetRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Snippet not found"));

        // Check if the user is the owner of the snippet or an admin
        if (!snippet.getUser().equals(user) && !user.getRoles().contains("ROLE_ADMIN")) {
            throw new RuntimeException("You don't have permission to update this snippet");
        }

        snippet.setTitle(snippetRequest.getTitle());
        snippet.setDescription(snippetRequest.getDescription());
        snippet.setContent(snippetRequest.getContent());
        snippet.setLanguage(snippetRequest.getLanguage());
        snippet.setLastModifiedDate(LocalDateTime.now());

        // Handle tags
        Set<Tag> tags = new HashSet<>();
        for (String tagName : snippetRequest.getTags()) {
            Tag tag = tagRepository.findByName(tagName)
                .orElseGet(() -> tagRepository.save(new Tag(tagName)));
            tags.add(tag);
        }
        snippet.setTags(tags);
        
        return snippetRepository.save(snippet);
    }

    @Transactional
    public void deleteSnippet(Long id){
        snippetRepository.deleteById(id);
    }

    public List<Snippet> searchSnippets(String keyword, String language, Set<String> tags){
        Specification<Snippet> spec = Specification.where(null);
        
        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and(SnippetSpecification.titleOrContentContains(keyword));
        }
        
        if (language != null && !language.isEmpty()) {
            spec = spec.and(SnippetSpecification.hasLanguage(language));
        }
        
        if (tags != null && !tags.isEmpty()) {
            spec = spec.and(SnippetSpecification.hasTags(tags));
        }
        
        return snippetRepository.findAll(spec);
    }

    // Additional business logic (e.g., search) can be added here

    public List<Snippet> getSnippetsByUser(User user) {
        return snippetRepository.findByUserId(user.getId());
    }
}