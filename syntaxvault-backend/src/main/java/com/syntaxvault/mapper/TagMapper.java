package com.syntaxvault.mapper;

import com.syntaxvault.dto.TagDTO;
import com.syntaxvault.model.Tag;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {

    /**
     * Converts a Tag entity to a TagDTO.
     *
     * @param tag the Tag entity
     * @return the TagDTO
     */
    public TagDTO toDTO(Tag tag) {
        TagDTO dto = new TagDTO();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        return dto;
    }

    /**
     * Converts a TagDTO to a Tag entity.
     *
     * @param dto the TagDTO
     * @return the Tag entity
     */
    public Tag toEntity(TagDTO dto) {
        Tag tag = new Tag();
        tag.setId(dto.getId());
        tag.setName(dto.getName());
        return tag;
    }
}