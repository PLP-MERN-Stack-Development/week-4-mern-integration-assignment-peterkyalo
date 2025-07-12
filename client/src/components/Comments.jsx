import React, { useState } from 'react';
import { authService, postService } from '../services/api';

const Comments = ({ postId, comments, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const user = authService.getCurrentUser();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await postService.addComment(postId, { content }, token);
      setContent('');
      onCommentAdded(res.comments);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="font-bold mb-3 text-lg text-gray-800">Comments</h3>
      <ul className="mb-4 space-y-3">
        {comments && comments.length > 0 ? comments.map((c, i) => (
          <li key={i} className="mb-2 border-b pb-2">
            <div className="text-gray-700">{c.content}</div>
            <div className="text-xs text-gray-500">{c.user?.name || 'User'} - {new Date(c.createdAt).toLocaleString()}</div>
          </li>
        )) : <li className="text-gray-500">No comments yet.</li>}
      </ul>
      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Add a comment..." className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Add Comment</button>
          {error && <div className="text-red-500">{error}</div>}
        </form>
      ) : (
        <div className="text-gray-500">Login to comment.</div>
      )}
    </div>
  );
};

export default Comments;
