package com.syntaxvault.model;

import jakarta.persistence.*;
import java.util.Set;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Entity
@Table(name = "Tags")
@NoArgsConstructor
@AllArgsConstructor
public class Tag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true, nullable = false, length = 50)
    private String name;

    @ManyToMany(mappedBy = "tags")
    private Set<Snippet> snippets;
    
    public Tag(String name) {
        this.name = name;
    }
}