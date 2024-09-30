package com.syntaxvault.repository;

import com.syntaxvault.model.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByUserUsername(String username);
}