package com.syntaxvault.controller;

import com.syntaxvault.dto.UserDTO;
import com.syntaxvault.model.User;
import com.syntaxvault.service.UserService;
import com.syntaxvault.dto.LoginRequest;
import com.syntaxvault.dto.RegisterRequest;
import com.syntaxvault.dto.JwtResponse;
import com.syntaxvault.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Utility method to convert User to UserDTO
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setRoles(user.getRoles());
        return dto;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody RegisterRequest registerRequest){
        // Create a new User entity
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(registerRequest.getPassword());
        // Register user
        User savedUser = userService.registerUser(user);
        UserDTO userDTO = convertToDTO(savedUser);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            String token = jwtUtil.generateToken(user.getUsername());
            UserDTO userDTO = convertToDTO(user);
            JwtResponse response = new JwtResponse(token, userDTO);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // Additional user-related endpoints
}