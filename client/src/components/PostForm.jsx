import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import axios from 'axios';

const PostForm = ({ onSubmit, initialData = {}, categories, loading, error }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    featuredImage: '',
    ...initialData,
  });
  const [validationError, setValidationError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    setForm({ ...form, ...initialData });
    // eslint-disable-next-line
  }, [initialData]);

  const validate = () => {
    if (!form.title.trim()) return 'Title is required';
    if (form.title.length > 100) return 'Title cannot exceed 100 characters';
    if (!form.content.trim()) return 'Content is required';
    if (!form.category) return 'Category is required';
    return '';
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleImageChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/posts/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setForm(f => ({ ...f, featuredImage: res.data.imageUrl }));
      setValidationError('');
    } catch (err) {
      setValidationError('Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const err = validate();
    if (err) return setValidationError(err);
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow mt-8 space-y-6 border border-blue-100">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{initialData._id ? 'Edit Post' : 'Create Post'}</h2>
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          maxLength={100}
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select a category</option>
          {categories && categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Featured Image</label>
        <div className="flex items-center gap-4">
          <input type="file" accept="image/*" onChange={handleImageChange} className="block" />
          <button type="button" onClick={handleImageUpload} disabled={imageUploading || !imageFile} className="bg-blue-500 text-white px-3 py-1 rounded disabled:bg-gray-300">
            {imageUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
        {form.featuredImage && (
          <img src={form.featuredImage} alt="Featured" className="mt-2 max-h-32 rounded border" />
        )}
      </div>
      {validationError && <div className="text-red-500">{validationError}</div>}
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        {loading ? 'Saving...' : initialData._id ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  );
};

export default PostForm;
