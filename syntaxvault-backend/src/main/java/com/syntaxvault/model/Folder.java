package com.syntaxvault.model;

import jakarta.persistence.*;
import java.util.Set;
import java.util.HashSet;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Entity
@Table(name = "Folders")
@NoArgsConstructor
@AllArgsConstructor
public class Folder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Folder parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Folder> subfolders = new HashSet<>();

    @OneToMany(mappedBy = "folder")
    private Set<Snippet> snippets = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String path;

    // Helper method to update path when parent changes
    public void updatePath() {
        if (parent == null) {
            this.path = "/" + name;
        } else {
            this.path = parent.getPath() + "/" + name;
        }
    }

    // Helper method to add a subfolder
    public void addSubfolder(Folder subfolder) {
        subfolders.add(subfolder);
        subfolder.setParent(this);
        subfolder.updatePath();
    }

    // Helper method to remove a subfolder
    public void removeSubfolder(Folder subfolder) {
        subfolders.remove(subfolder);
        subfolder.setParent(null);
    }
} 