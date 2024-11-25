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
    isPublic: boolean;
  }
  
  export interface SnippetInput {
    title: string;
    description: string;
    content: string;
    language: string;
    tags: string[];
    isPublic: boolean;
  }
  
  export interface SnippetUpdateInput extends Partial<SnippetInput> {
    isPublic?: boolean;
  }
  
  export interface Collection {
    id: number;
    name: string;
    username: string;
    snippetIds: number[];
    isPublic: boolean;
  }
  
  export interface CollectionRequest {
    name: string;
    snippetIds: number[];
    isPublic: boolean;
  }
  
  export interface CollectionInput {
    name: string;
    snippetIds?: number[];
  }
