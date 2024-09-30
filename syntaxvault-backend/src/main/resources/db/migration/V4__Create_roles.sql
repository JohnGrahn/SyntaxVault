-- Create Roles Table
CREATE TABLE Roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Create User_Roles Table
CREATE TABLE User_Roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Add indexes
CREATE INDEX idx_user_roles_user_id ON User_Roles(user_id);
CREATE INDEX idx_user_roles_role ON User_Roles(role);