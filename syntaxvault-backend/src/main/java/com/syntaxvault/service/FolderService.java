package com.syntaxvault.service;

import com.syntaxvault.dto.FolderDTO;
import com.syntaxvault.dto.FolderRequest;
import com.syntaxvault.model.Folder;
import com.syntaxvault.model.User;
import com.syntaxvault.repository.FolderRepository;
import com.syntaxvault.repository.UserRepository;
import com.syntaxvault.mapper.FolderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FolderService {
    
    @Autowired
    private FolderRepository folderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FolderMapper folderMapper;

    @Transactional
    public FolderDTO createFolder(FolderRequest folderRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if folder with same name exists at the same level
        if (folderRequest.getParentId() != null) {
            if (folderRepository.existsByParentIdAndName(folderRequest.getParentId(), folderRequest.getName())) {
                throw new RuntimeException("A folder with this name already exists in the selected location");
            }
        } else if (folderRepository.existsByNameAndUserUsernameAndParentIsNull(folderRequest.getName(), username)) {
            throw new RuntimeException("A root folder with this name already exists");
        }

        Folder folder = new Folder();
        folder.setName(folderRequest.getName());
        folder.setUser(user);

        if (folderRequest.getParentId() != null) {
            Folder parent = folderRepository.findById(folderRequest.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent folder not found"));
            folder.setParent(parent);
        }

        folder.updatePath();
        Folder savedFolder = folderRepository.save(folder);
        return folderMapper.toDTO(savedFolder);
    }

    @Transactional(readOnly = true)
    public List<FolderDTO> getRootFolders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return folderRepository.findByUserUsernameAndParentIsNull(username).stream()
            .map(folderMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<FolderDTO> getFolderById(Long id) {
        return folderRepository.findByIdWithSubfolders(id)
            .map(folderMapper::toDTO);
    }

    @Transactional
    public FolderDTO updateFolder(Long id, FolderRequest folderRequest) {
        Folder folder = folderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Folder not found"));

        // Check if new name would conflict with existing folders at the same level
        if (!folder.getName().equals(folderRequest.getName())) {
            if (folderRequest.getParentId() != null) {
                if (folderRepository.existsByParentIdAndName(folderRequest.getParentId(), folderRequest.getName())) {
                    throw new RuntimeException("A folder with this name already exists in the selected location");
                }
            } else if (folderRepository.existsByNameAndUserUsernameAndParentIsNull(
                    folderRequest.getName(), folder.getUser().getUsername())) {
                throw new RuntimeException("A root folder with this name already exists");
            }
        }

        folder.setName(folderRequest.getName());

        if (folderRequest.getParentId() != null && 
            (folder.getParent() == null || !folder.getParent().getId().equals(folderRequest.getParentId()))) {
            Folder newParent = folderRepository.findById(folderRequest.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent folder not found"));
            folder.setParent(newParent);
        } else if (folderRequest.getParentId() == null && folder.getParent() != null) {
            folder.setParent(null);
        }

        folder.updatePath();
        Folder updatedFolder = folderRepository.save(folder);
        return folderMapper.toDTO(updatedFolder);
    }

    @Transactional
    public void deleteFolder(Long id) {
        folderRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<FolderDTO> getAllFolders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return folderRepository.findByUserUsername(username).stream()
            .map(folderMapper::toDTO)
            .collect(Collectors.toList());
    }
} 