package com.syntaxvault.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
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
    @JsonBackReference
    private Set<Snippet> snippets;
    
    public Tag(String name) {
        this.name = name;
    }
}