package com.syntaxvault.repository;

import com.syntaxvault.model.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByUserUsername(String username);
    
    @Query("SELECT c FROM Collection c LEFT JOIN FETCH c.user LEFT JOIN FETCH c.snippets WHERE c.id = :id")
    Collection findByIdWithUserAndSnippets(@Param("id") Long id);

    List<Collection> findByIsPublicTrue();
    
    Optional<Collection> findByIdAndIsPublicTrue(Long id);
}