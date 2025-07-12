import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PostList = ({ posts, loading, error, fetchPosts, onDelete }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedPosts, setPaginatedPosts] = useState(posts || []);

  useEffect(() => {
    fetchPosts({ page, q: search });
    // eslint-disable-next-line
  }, [page, search]);

  useEffect(() => {
    // If posts is an object with posts/total/pages (from backend pagination), use it
    if (posts && posts.posts) {
      setPaginatedPosts(posts.posts);
      setTotalPages(posts.pages || 1);
    } else if (Array.isArray(posts)) {
      setPaginatedPosts(posts);
      setTotalPages(1);
    } else {
      setPaginatedPosts([]);
      setTotalPages(1);
    }
  }, [posts]);

  if (loading) return <div className="text-center py-8 text-lg text-blue-600">Loading posts...</div>;
  if (error) return <div className="text-center py-8 text-lg text-red-600">Error: {error}</div>;
  if (!paginatedPosts || paginatedPosts.length === 0) return <div className="text-center py-8 text-gray-500">No posts found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Blog Posts</h2>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <ul className="space-y-3">
        {paginatedPosts.map(post => (
          <li key={post._id} className="flex items-center justify-between bg-gray-50 p-3 rounded hover:bg-blue-50 transition">
            <Link to={`/posts/${post._id}`} className="text-lg font-medium text-blue-700 hover:underline">
              {post.title}
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(post._id)}
                className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Prev
        </button>
        <span className="text-gray-700">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded ${page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList;
