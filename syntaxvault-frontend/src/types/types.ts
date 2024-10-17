export interface Tag {
    id: number;
    name: string;
  }
  
  export interface Snippet {
    id: number;
    title: string;
    description: string;
    content: string;
    language: string;
    creationDate: string;
    lastModifiedDate: string;
    username: string;
    tags: Tag[];
  }
  
  export interface SnippetInput {
    title: string;
    description: string;
    content: string;
    language: string;
    tags: string[]; // Changed from number[] to string[]
  }
  
  export interface SnippetUpdateInput extends Partial<SnippetInput> {}
  
  export interface Collection {
    id: number;
    name: string;
    username: string; // Owner's username
    snippetIds: number[];
  }
  
  export interface CollectionRequest {
    name: string;
    snippetIds?: number[];
  }
  
  export interface CollectionInput {
    name: string;
    snippetIds?: number[];
  }