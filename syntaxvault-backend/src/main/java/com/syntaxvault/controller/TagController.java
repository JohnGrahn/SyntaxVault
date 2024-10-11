package com.syntaxvault.controller;

import com.syntaxvault.dto.TagDTO;
import com.syntaxvault.mapper.TagMapper;
import com.syntaxvault.model.Tag;
import com.syntaxvault.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private TagMapper tagMapper;

    /**
     * Retrieves all tags.
     *
     * @return a list of TagDTOs
     */
    @GetMapping
    public ResponseEntity<List<TagDTO>> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        List<TagDTO> tagDTOs = tags.stream()
                                    .map(tagMapper::toDTO)
                                    .collect(Collectors.toList());
        return ResponseEntity.ok(tagDTOs);
    }

    /**
     * Creates a new tag.
     *
     * @param tagDTO the TagDTO containing tag details
     * @return the created TagDTO
     */
    @PostMapping
    public ResponseEntity<TagDTO> createTag(@Valid @RequestBody TagDTO tagDTO) {
        Tag tag = tagMapper.toEntity(tagDTO);
        Tag savedTag = tagRepository.save(tag);
        TagDTO savedTagDTO = tagMapper.toDTO(savedTag);
        return ResponseEntity.ok(savedTagDTO);
    }

    /**
     * Retrieves a tag by its ID.
     *
     * @param id the ID of the tag
     * @return the TagDTO if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<TagDTO> getTagById(@PathVariable Long id) {
        return tagRepository.findById(id)
                .map(tagMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Updates an existing tag.
     *
     * @param id the ID of the tag to update
     * @param tagDTO the TagDTO containing updated tag details
     * @return the updated TagDTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<TagDTO> updateTag(@PathVariable Long id, @Valid @RequestBody TagDTO tagDTO) {
        return tagRepository.findById(id)
                .map(existingTag -> {
                    existingTag.setName(tagDTO.getName());
                    Tag updatedTag = tagRepository.save(existingTag);
                    return tagMapper.toDTO(updatedTag);
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes a tag by its ID.
     *
     * @param id the ID of the tag to delete
     * @return a response indicating the outcome
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        if(!tagRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tagRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}