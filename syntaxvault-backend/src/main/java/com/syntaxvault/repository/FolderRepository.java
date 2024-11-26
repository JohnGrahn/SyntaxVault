package com.syntaxvault.repository;

import com.syntaxvault.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByUserUsername(String username);
    
    List<Folder> findByUserUsernameAndParentIsNull(String username);
    
    @Query("SELECT f FROM Folder f LEFT JOIN FETCH f.subfolders WHERE f.id = :id")
    Optional<Folder> findByIdWithSubfolders(@Param("id") Long id);
    
    @Query("SELECT f FROM Folder f LEFT JOIN FETCH f.snippets WHERE f.id = :id")
    Optional<Folder> findByIdWithSnippets(@Param("id") Long id);
    
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Folder f WHERE f.parent.id = :parentId AND f.name = :name")
    boolean existsByParentIdAndName(@Param("parentId") Long parentId, @Param("name") String name);
    
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Folder f WHERE f.parent IS NULL AND f.name = :name AND f.user.username = :username")
    boolean existsByNameAndUserUsernameAndParentIsNull(@Param("name") String name, @Param("username") String username);
} 