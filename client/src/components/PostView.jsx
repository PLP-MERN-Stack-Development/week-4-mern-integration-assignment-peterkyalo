import React, { useEffect, useState } from 'react';
import Comments from './Comments';

const PostView = ({ post, loading, error, fetchPost }) => {
  const [comments, setComments] = useState(post?.comments || []);

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line
  }, [fetchPost]);

  useEffect(() => {
    setComments(post?.comments || []);
  }, [post]);

  if (loading) return <div className="text-center py-8 text-lg text-blue-600">Loading post...</div>;
  if (error) return <div className="text-center py-8 text-lg text-red-600">Error: {error}</div>;
  if (!post) return <div className="text-center py-8 text-gray-500">Post not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{post.title}</h2>
      <div className="mb-4 text-gray-600 flex flex-wrap gap-4 text-sm">
        <span>Category: <span className="font-medium text-blue-700">{post.category?.name}</span></span>
        <span>Author: <span className="font-medium text-blue-700">{post.author?.name}</span></span>
      </div>
      {post.featuredImage && (
        <img src={post.featuredImage} alt="Featured" className="max-h-64 rounded border mb-4" />
      )}
      <div className="prose max-w-none mb-6 text-gray-800">{post.content}</div>
      <Comments postId={post._id} comments={comments} onCommentAdded={setComments} />
    </div>
  );
};

export default PostView;
