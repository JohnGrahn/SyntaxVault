// src/components/Snippets/SnippetForm.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addSnippet, updateSnippet, fetchSnippets } from '../../features/snippets/snippetsSlice';
import { fetchTags, createTag } from '../../features/tags/tagsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Tag } from '../../types/types';
import SearchableTagSelect from '../Tags/SearchableTagSelect';

const SnippetForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { snippets, loading, error } = useAppSelector((state) => state.snippets);
  const { tags } = useAppSelector((state) => state.tags);

  const isEditing = Boolean(id);
  const existingSnippet = snippets.find((s) => s.id === Number(id));

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    content: string;
    language: string;
    tags: Tag[];
    isPublic: boolean;
  }>({
    title: '',
    description: '',
    content: '',
    language: '',
    tags: [],
    isPublic: false,
  });

  const [newTag, setNewTag] = useState<string>('');

  useEffect(() => {
    if (tags.length === 0) {
      dispatch(fetchTags());
    }
    if (isEditing && !existingSnippet) {
      dispatch(fetchSnippets({}));
    }
  }, [dispatch, isEditing, existingSnippet, tags.length]);

  useEffect(() => {
    if (isEditing && existingSnippet) {
      setFormData({
        title: existingSnippet.title || '',
        description: existingSnippet.description || '',
        content: existingSnippet.content || '',
        language: existingSnippet.language || '',
        tags: existingSnippet.tags || [],
        isPublic: Boolean(existingSnippet.isPublic) // Ensure it's a boolean
      });
    }
  }, [isEditing, existingSnippet]);

  const { title, description, content, language } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagSelect = (tag: Tag) => {
    if (!formData.tags.some(t => t.id === tag.id)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagDeselect = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t.id !== tagId)
    }));
  };

  const handleAddTag = async () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag === '') return;

    // Check if tag already exists
    const existing = tags.find((t) => t.name.toLowerCase() === trimmedTag.toLowerCase());
    if (existing) {
      // Tag exists, add to selected tags if not already added
      if (!formData.tags.some((t) => t.id === existing.id)) {
        setFormData({ ...formData, tags: [...formData.tags, existing] });
      }
    } else {
      try {
        const resultAction = await dispatch(createTag(trimmedTag));
        if (createTag.fulfilled.match(resultAction)) {
          const newTagFromBackend = resultAction.payload;
          setFormData({ ...formData, tags: [...formData.tags, newTagFromBackend] });
        } else {
          console.error('Failed to create tag:', resultAction.payload);
        }
      } catch (err) {
        console.error('Failed to create tag:', err);
      }
    }
    setNewTag('');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const snippetData = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      language: formData.language,
      tags: formData.tags.map(tag => tag.name),
      isPublic: Boolean(formData.isPublic) // Ensure it's a boolean
    };
    console.log('Submitting snippetData:', snippetData); // Debug log

    if (isEditing && id) {
      try {
        const result = await dispatch(updateSnippet({ id: Number(id), snippetData })).unwrap();
        console.log('Update result:', result); // Add this debug log
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to update snippet:', err);
      }
    } else {
      try {
        await dispatch(addSnippet(snippetData)).unwrap();
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to add snippet:', err);
      }
    }
  };

  // Prepare the value for the select element as an array of tag names
  const selectedTagNames = formData.tags.map(tag => tag.name);

  return (
    <div className="flex justify-center items-center p-4">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl mb-4">{isEditing ? 'Edit Snippet' : 'Add New Snippet'}</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Content</label>
          <textarea
            name="content"
            value={content}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded h-40"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Language</label>
          <input
            type="text"
            name="language"
            value={language}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g., javascript, python"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Tags</label>
          <SearchableTagSelect
            selectedTags={formData.tags}
            onTagSelect={handleTagSelect}
            onTagDeselect={handleTagDeselect}
          />
          <div className="mt-2 flex">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag"
              className="flex-grow px-3 py-2 border rounded-l"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
            >
              Add Tag
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="mr-2"
            />
            Make this snippet public
          </label>
          <p className="text-sm text-gray-600">
            Public snippets can be viewed by anyone, but can only be edited by you.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? (isEditing ? 'Updating...' : 'Adding...') : isEditing ? 'Update Snippet' : 'Add Snippet'}
        </button>
      </form>
    </div>
  );
};

export default SnippetForm;
