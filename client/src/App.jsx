import React, { useState, useCallback, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import PostList from './components/PostList';
import PostView from './components/PostView';
import PostForm from './components/PostForm';
import NavBar from './components/NavBar';
import useApi from './hooks/useApi';
import axios from 'axios';
import Register from './components/Register';
import Login from './components/Login';
import { authService } from './services/api';

// Posts context for global state
const PostsContext = createContext();
export const usePosts = () => useContext(PostsContext);

const PostListPage = () => {
  const { posts, loading, error, fetchPosts, deletePostOptimistic } = usePosts();
  const [deleteError, setDeleteError] = useState(null);

  // Accept params for pagination/search
  const handleFetchPosts = (params = {}) => {
    fetchPosts(params);
  };

  const handleDelete = async (id) => {
    setDeleteError(null);
    // Optimistically remove post
    const removed = deletePostOptimistic(id);
    try {
      await axios.delete(`/api/posts/${id}`);
      // Optionally: refetch posts to ensure sync
      fetchPosts();
    } catch (err) {
      // Restore post if backend fails
      removed.restore();
      setDeleteError('Failed to delete post');
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100 py-8">
      <div className="max-w-3xl mx-auto">
        <PostList posts={posts} loading={loading} error={error} fetchPosts={handleFetchPosts} onDelete={handleDelete} />
        {deleteError && <div className="text-center text-red-500 mt-4">{deleteError}</div>}
      </div>
    </div>
  );
};

const PostViewPage = () => {
  const { id } = useParams();
  const { data: post, loading, error, execute } = useApi(`/api/posts/${id}`);
  return <PostView post={post} loading={loading} error={error} fetchPost={execute} />;
};

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { data: categories = [], execute: fetchCategories } = useApi('/api/categories');
  const { addPostOptimistic, updatePostWithRealData, fetchPosts } = usePosts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async (form) => {
    setLoading(true);
    setError(null);
    try {
      // Optimistically add post to UI
      const tempId = Date.now().toString();
      addPostOptimistic({ ...form, _id: tempId, title: form.title, content: form.content });
      const res = await axios.post('/api/posts', form);
      // Update the temp post with the real post data
      updatePostWithRealData(tempId, res.data);
      // Optionally: refetch posts to ensure sync
      fetchPosts();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  }, [navigate, addPostOptimistic, updatePostWithRealData, fetchPosts]);

  React.useEffect(() => { fetchCategories(); }, [fetchCategories]);

  return <PostForm onSubmit={handleSubmit} categories={categories} loading={loading} error={error} />;
};

const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  return children;
};

const PostsProvider = ({ children }) => {
  const [queryParams, setQueryParams] = useState({});
  const { data: posts = [], loading, error, execute } = useApi(`/api/posts${buildQueryString(queryParams)}`);
  const [localPosts, setLocalPosts] = useState(posts);

  React.useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  // Helper to build query string
  function buildQueryString(params) {
    const esc = encodeURIComponent;
    const q = Object.keys(params)
      .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
    return q ? `?${q}` : '';
  }

  // Accept params for pagination/search
  const fetchPosts = (params = {}) => {
    setQueryParams(params);
    execute();
  };

  // Optimistically add a post
  const addPostOptimistic = (post) => {
    setLocalPosts(prev => [post, ...prev]);
  };

  // Update the temp post with the real post data
  const updatePostWithRealData = (tempId, realPost) => {
    setLocalPosts(prev => prev.map(p => (p._id === tempId ? realPost : p)));
  };

  // Optimistically delete a post
  const deletePostOptimistic = (id) => {
    let removed;
    setLocalPosts(prev => {
      removed = prev.find(p => p._id === id);
      return prev.filter(p => p._id !== id);
    });
    return {
      restore: () => setLocalPosts(prev => [removed, ...prev]),
    };
  };

  return (
    <PostsContext.Provider value={{ posts: localPosts, loading, error, fetchPosts, addPostOptimistic, updatePostWithRealData, deletePostOptimistic }}>
      {children}
    </PostsContext.Provider>
  );
};

const App = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
    <Router>
      <NavBar />
      <PostsProvider>
        <Routes>
          <Route path="/" element={<PostListPage />} />
          <Route path="/posts/:id" element={<PostViewPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          } />
        </Routes>
      </PostsProvider>
    </Router>
  </div>
);

export default App;
