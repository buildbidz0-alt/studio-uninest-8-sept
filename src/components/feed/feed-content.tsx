
'use client';

import { useState, useEffect } from 'react';
import CreatePostForm from '@/components/feed/create-post-form';
import PostCard, { type Post } from '@/components/feed/post-card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function FeedContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // TODO: Fetch posts from your API
    // e.g., fetch('/api/feed').then(res => res.json()).then(data => setPosts(data));
    setLoading(false);
  }, []);


  const addPost = (content: string) => {
    // TODO: Send new post to your API and update the state with the response
    const newPost: Post = {
      id: Date.now(),
      author: user?.user_metadata?.full_name || 'Guest User',
      handle: user?.email?.split('@')[0] || 'guest',
      avatarUrl: user?.user_metadata?.avatar_url || 'https://picsum.photos/seed/guest/40/40',
      content,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
  };

  const deletePost = (id: number) => {
    // TODO: Send delete request to your API
    setPosts(posts.filter(p => p.id !== id));
  };

  const editPost = (id: number, newContent: string) => {
    // TODO: Send edit request to your API
    setPosts(posts.map(p => p.id === id ? { ...p, content: newContent } : p));
  };

  const addComment = (postId: number, commentContent: string) => {
    // TODO: Send new comment to your API
    const newComment = {
      id: Date.now(),
      author: user?.user_metadata?.full_name || 'Guest User',
      handle: user?.email?.split('@')[0] || 'guest',
      avatarUrl: user?.user_metadata?.avatar_url || 'https://picsum.photos/seed/guest/40/40',
      content: commentContent,
    };
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, comments: [newComment, ...p.comments] } 
        : p
    ));
  };
  
  const updateLikes = (postId: number, newLikeCount: number) => {
    // TODO: Send like/unlike request to your API
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: newLikeCount } : p));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Social Feed</h1>
      <div className="space-y-8">
        <CreatePostForm onPost={addPost} />
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onDelete={deletePost}
                onEdit={editPost}
                onComment={addComment}
                onLike={updateLikes}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <h2 className="text-xl font-semibold">No posts yet</h2>
              <p>Be the first to share something with the community!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
