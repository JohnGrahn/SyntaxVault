-- Index on Snippets.language for quick filtering by language
CREATE INDEX idx_snippets_language ON Snippets(language);

-- Index on Snippets.title for faster search by title
CREATE INDEX idx_snippets_title ON Snippets(title);

-- Index on Tags.name for efficient tag lookup
CREATE INDEX idx_tags_name ON Tags(name);

-- Composite index on Snippet_Tags.tag_id for quicker tag-based snippet retrieval
CREATE INDEX idx_snippet_tags_tag_id ON Snippet_Tags(tag_id);

-- Composite index on Snippet_Tags.snippet_id for faster snippet-tag association lookups
CREATE INDEX idx_snippet_tags_snippet_id ON Snippet_Tags(snippet_id);