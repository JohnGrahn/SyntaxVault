package com.syntaxvault.service;

import com.syntaxvault.model.Snippet;
import com.syntaxvault.model.Tag;
import com.syntaxvault.model.User;
import com.syntaxvault.repository.SnippetRepository;
import com.syntaxvault.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;
import java.util.HashSet;

@Service
public class SnippetService {
    
    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private TagRepository tagRepository;

    @Transactional
    public Snippet createSnippet(Snippet snippet, Set<String> tagNames, User user) {
        // Assign user to snippet
        snippet.setUser(user);
        
        // Handle tags
        Set<Tag> tags = new HashSet<>();
        for (String tagName : tagNames) {
            Tag tag = tagRepository.findByName(tagName)
                .orElseGet(() -> {
                    Tag newTag = new Tag(tagName);
                    return tagRepository.save(newTag);
                });
            tags.add(tag);
        }
        snippet.setTags(tags);
        
        // Save snippet
        return snippetRepository.save(snippet);
    }

    // Other snippet-related business logic (e.g., update, delete, search)
}