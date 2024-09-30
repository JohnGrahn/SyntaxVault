package com.syntaxvault.specification;

import com.syntaxvault.model.Snippet;
import com.syntaxvault.model.Tag;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import java.util.Set;

public class SnippetSpecification {

    public static Specification<Snippet> titleOrContentContains(String keyword) {
        return (root, query, builder) -> 
            builder.or(
                builder.like(builder.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                builder.like(builder.lower(root.get("content")), "%" + keyword.toLowerCase() + "%")
            );
    }

    public static Specification<Snippet> hasLanguage(String language) {
        return (root, query, builder) -> 
            builder.equal(builder.lower(root.get("language")), language.toLowerCase());
    }

    public static Specification<Snippet> hasTags(Set<String> tags) {
        return (root, query, builder) -> {
            Join<Snippet, Tag> tagJoin = root.join("tags", JoinType.LEFT);
            return tagJoin.get("name").in(tags);
        };
    }
}