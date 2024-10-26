ALTER TABLE Snippets
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_snippets_is_public ON Snippets(is_public);

