// src/components/Snippets/SnippetForm.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { addSnippet, updateSnippet, fetchSnippets } from '../../features/snippets/snippetsSlice';
import { fetchTags } from '../../features/tags/tagsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Tag } from '../../types/types';

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
  }>({
    title: '',
    description: '',
    content: '',
    language: '',
    tags: [],
  });

  useEffect(() => {
    if (tags.length === 0) {
      dispatch(fetchTags());
    }
    if (isEditing && !existingSnippet) {
      dispatch(fetchSnippets());
    } else if (isEditing && existingSnippet) {
      setFormData({
        title: existingSnippet.title,
        description: existingSnippet.description,
        content: existingSnippet.content,
        language: existingSnippet.language,
        tags: existingSnippet.tags,
      });
    }
  }, [dispatch, isEditing, existingSnippet, tags.length]);

  const { title, description, content, language, tags: snippetTags } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedTags: Tag[] = selectedOptions.map((option) => {
      const tag = tags.find((t) => t.name === option.value);
      return tag ? tag : { id: 0, name: option.value }; // Default Tag if not found
    });
    setFormData({ ...formData, tags: selectedTags });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const snippetData = {
      ...formData,
      tags: formData.tags.map(tag => tag.name), // Changed from tag.id to tag.name
    };
    
    if (isEditing && id) {
      try {
        await dispatch(updateSnippet({ id: Number(id), snippetData: snippetData })).unwrap();
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
          <select
            multiple
            value={selectedTagNames}
            onChange={onTagsChange}
            className="w-full px-3 py-2 border rounded h-32"
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-600 mt-1">Hold down the Ctrl (windows) or Command (Mac) button to select multiple options.</p>
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