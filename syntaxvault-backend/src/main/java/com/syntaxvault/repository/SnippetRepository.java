package com.syntaxvault.repository;

import com.syntaxvault.model.Snippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SnippetRepository extends JpaRepository<Snippet, Long>, JpaSpecificationExecutor<Snippet> {
    
    // Find snippets by user ID
    List<Snippet> findByUserId(Long userId);

    // Find snippets by language
    List<Snippet> findByLanguage(String language);

    // Find snippets containing a specific keyword in title or content
    @Query("SELECT s FROM Snippet s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Snippet> findByTitleOrContentContaining(@Param("keyword") String keyword);

    // Find snippets by tag name
    @Query("SELECT s FROM Snippet s JOIN s.tags t WHERE LOWER(t.name) = LOWER(:tagName)")
    List<Snippet> findByTagName(@Param("tagName") String tagName);

    // Find most recent snippets, limited by count
    List<Snippet> findTop10ByOrderByCreationDateDesc();

    @Query("SELECT DISTINCT s FROM Snippet s LEFT JOIN FETCH s.user LEFT JOIN FETCH s.tags")
    List<Snippet> findAllWithUserAndTags();

    // Find snippets by user ID with User and Tags fetched
    @Query("SELECT DISTINCT s FROM Snippet s LEFT JOIN FETCH s.user LEFT JOIN FETCH s.tags WHERE s.user.id = :userId")
    List<Snippet> findByUserIdWithUserAndTags(@Param("userId") Long userId);
}
