CREATE TABLE Folders (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id BIGINT REFERENCES Folders(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES Users(id),
    path VARCHAR(1000) NOT NULL
);

CREATE INDEX idx_folders_parent_id ON Folders(parent_id);
CREATE INDEX idx_folders_user_id ON Folders(user_id);
CREATE INDEX idx_folders_path ON Folders(path);

ALTER TABLE Snippets
ADD COLUMN folder_id BIGINT REFERENCES Folders(id) ON DELETE SET NULL; 