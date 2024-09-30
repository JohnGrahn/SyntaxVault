-- Create Collections Table
CREATE TABLE Collections (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create Snippet_Collections Table
CREATE TABLE Snippet_Collections (
    snippet_id BIGINT NOT NULL,
    collection_id BIGINT NOT NULL,
    PRIMARY KEY (snippet_id, collection_id),
    FOREIGN KEY (snippet_id) REFERENCES Snippets(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES Collections(id) ON DELETE CASCADE
);

-- Indexes for Collections
CREATE INDEX idx_collections_user_id ON Collections(user_id);
CREATE INDEX idx_snippet_collections_snippet_id ON Snippet_Collections(snippet_id);
CREATE INDEX idx_snippet_collections_collection_id ON Snippet_Collections(collection_id);