package com.syntaxvault.service;

import com.syntaxvault.dto.SnippetDTO;
import com.syntaxvault.mapper.SnippetMapper;
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
import java.util.stream.Collectors;

@Service
public class SnippetService {
    
    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private TagRepository tagRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SnippetMapper snippetMapper; // Inject the mapper

    @Transactional
    public SnippetDTO createSnippet(SnippetRequest snippetRequest, User user) {
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
        
        Snippet savedSnippet = snippetRepository.save(snippet);
        return snippetMapper.toDTO(savedSnippet);
    }

    public Optional<SnippetDTO> getSnippetByIdDTO(Long id){
        Optional<Snippet> snippetOpt = snippetRepository.findById(id);
        return snippetOpt.map(snippetMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<SnippetDTO> getAllSnippetsDTO(){
        List<Snippet> snippets = snippetRepository.findAll();
        return snippets.stream()
                       .map(snippetMapper::toDTO)
                       .collect(Collectors.toList());
    }

    @Transactional
    public SnippetDTO updateSnippet(Long id, SnippetRequest snippetRequest, User user) {
        Snippet snippet = snippetRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Snippet not found"));

        // Fetch the user with snippets collection initialized
        User fullUser = userRepository.findByIdWithSnippets(user.getId())
                            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the user is the owner of the snippet or an admin
        if (!snippet.getUser().equals(fullUser) && !fullUser.getRoles().contains("ROLE_ADMIN")) {
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
        
        Snippet updatedSnippet = snippetRepository.save(snippet);
        return snippetMapper.toDTO(updatedSnippet);
    }

    @Transactional
    public void deleteSnippet(Long id){
        snippetRepository.deleteById(id);
    }

    public List<Snippet> searchSnippets(String keyword, String language, Set<String> tags){
        // Assuming search returns entities; consider mapping to DTOs inside transaction
        return snippetRepository.findAll(/* specifications */);
    }

    public List<SnippetDTO> getSnippetsByUserDTO(User user) {
        List<Snippet> snippets = snippetRepository.findByUserId(user.getId());
        return snippets.stream()
                       .map(snippetMapper::toDTO)
                       .collect(Collectors.toList());
    }
}