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
import org.springframework.security.core.context.SecurityContextHolder;
import com.syntaxvault.model.Folder;
import com.syntaxvault.repository.FolderRepository;

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

    @Autowired
    private FolderRepository folderRepository;

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
        snippet.setIsPublic(snippetRequest.isPublic()); // Add this line to set isPublic

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
    public List<SnippetDTO> getAllSnippetsDTO() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Snippet> snippets = snippetRepository.findByUserIdWithUserAndTags(currentUser.getId());
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
        snippet.setIsPublic(snippetRequest.isPublic()); // Add this line to update the isPublic flag
        System.out.println("Received isPublic value: " + snippetRequest.isPublic());

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

    @Transactional(readOnly = true)
    public List<SnippetDTO> searchSnippets(String keyword, String language, List<String> tags) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Snippet> allSnippets = snippetRepository.findAllWithUserAndTags();
        
        return allSnippets.stream()
            .filter(snippet -> snippet.getUser().equals(currentUser) || snippet.getIsPublic())
            .filter(snippet -> (keyword == null || keyword.isEmpty() ||
                                snippet.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                                snippet.getContent().toLowerCase().contains(keyword.toLowerCase())))
            .filter(snippet -> (language == null || language.isEmpty() ||
                                snippet.getLanguage().equalsIgnoreCase(language)))
            .filter(snippet -> (tags == null || tags.isEmpty() ||
                                snippet.getTags().stream().anyMatch(tag -> tags.contains(tag.getName()))))
            .map(snippet -> {
                SnippetDTO dto = snippetMapper.toDTO(snippet);
                dto.setUsername(snippet.getUser().getUsername());
                return dto;
            })
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SnippetDTO> getSnippetsByUserDTO(User user) {
        List<Snippet> snippets = snippetRepository.findByUserIdWithUserAndTags(user.getId());
        return snippets.stream()
                       .map(snippetMapper::toDTO)
                       .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SnippetDTO> getPublicSnippets() {
        List<Snippet> publicSnippets = snippetRepository.findByIsPublicTrue();
        return publicSnippets.stream()
                           .map(snippetMapper::toDTO)
                           .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<SnippetDTO> getPublicSnippetById(Long id) {
        return snippetRepository.findByIdAndIsPublicTrue(id)
                              .map(snippetMapper::toDTO);
    }

    @Transactional
    public SnippetDTO moveSnippet(Long snippetId, Long folderId, User user) {
        Snippet snippet = snippetRepository.findById(snippetId)
            .orElseThrow(() -> new RuntimeException("Snippet not found"));

        // Check if user owns the snippet by comparing IDs
        if (!snippet.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to move this snippet");
        }

        // If folderId is null, remove from current folder
        if (folderId == null) {
            snippet.setFolder(null);
        } else {
            Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

            // Check if user owns the folder by comparing IDs
            if (!folder.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("You don't have permission to move to this folder");
            }

            snippet.setFolder(folder);
        }

        snippet.setLastModifiedDate(LocalDateTime.now());
        Snippet savedSnippet = snippetRepository.save(snippet);
        return snippetMapper.toDTO(savedSnippet);
    }

    @Transactional(readOnly = true)
    public List<SnippetDTO> getSnippetsByFolder(Long folderId, User user) {
        Folder folder = folderRepository.findById(folderId)
            .orElseThrow(() -> new RuntimeException("Folder not found"));

        // Check if user owns the folder by comparing IDs
        if (!folder.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to access this folder");
        }

        // If the folder is empty, return an empty list instead of throwing an error
        if (folder.getSnippets() == null || folder.getSnippets().isEmpty()) {
            return List.of();
        }

        return folder.getSnippets().stream()
            .map(snippetMapper::toDTO)
            .collect(Collectors.toList());
    }
}
