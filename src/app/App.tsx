import { useState, useEffect } from 'react';
import { BlogPost, Comment, User } from '@/app/types/blog';
import { Header } from '@/app/components/Header';
import { LoginModal } from '@/app/components/LoginModal';
import { BlogList } from '@/app/components/BlogList';
import { BlogPostView } from '@/app/components/BlogPostView';
import { AdminPanel } from '@/app/components/AdminPanel';
import { Toaster } from '@/app/components/ui/sonner';
import { toast } from 'sonner';

const STORAGE_KEY = 'miniblog_posts';
const COMMENTS_KEY = 'miniblog_comments';
const USER_KEY = 'miniblog_user';

// Sample initial posts
const samplePosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Modern Web Development',
    excerpt: 'Explore the fundamentals of building responsive and performant web applications in 2026.',
    content: `Modern web development has evolved tremendously over the past few years. Today's developers have access to powerful tools and frameworks that make building complex applications easier than ever.

In this article, we'll explore the key concepts that every modern web developer should understand. From responsive design principles to performance optimization, we'll cover the essential skills needed to create amazing user experiences.

The landscape of web development continues to change rapidly, but the core principles remain the same: build fast, accessible, and user-friendly applications that solve real problems.

Whether you're just starting out or looking to upgrade your skills, understanding these fundamentals will set you up for success in your development journey.`,
    author: 'Sarah Johnson',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    createdAt: '2026-01-25T10:00:00.000Z',
    updatedAt: '2026-01-25T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'The Art of Minimalist Design',
    excerpt: 'Learn how simplicity and elegance can create powerful and memorable user interfaces.',
    content: `Minimalist design is more than just a trend—it's a philosophy that prioritizes clarity, functionality, and beauty through simplicity.

By stripping away unnecessary elements and focusing on what truly matters, minimalist design creates interfaces that are both elegant and highly functional. This approach reduces cognitive load and helps users focus on their goals.

The key to successful minimalist design lies in understanding what to keep and what to remove. Every element should serve a purpose, and every decision should be intentional.

Color, typography, and whitespace become powerful tools in a minimalist designer's toolkit. When used thoughtfully, these elements can create stunning visual hierarchies and guide users effortlessly through your interface.`,
    author: 'Michael Chen',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop',
    createdAt: '2026-01-26T14:30:00.000Z',
    updatedAt: '2026-01-26T14:30:00.000Z',
  },
  {
    id: '3',
    title: 'Building Better User Experiences',
    excerpt: 'Discover the principles and practices that lead to exceptional user experiences in digital products.',
    content: `User experience design is at the heart of every successful digital product. It's the difference between an app that users love and one they abandon after the first use.

Great UX starts with empathy—truly understanding your users' needs, goals, and pain points. This understanding should guide every design decision you make.

Research shows that users form opinions about your product within seconds of their first interaction. This makes first impressions crucial, but maintaining that quality throughout the entire user journey is what separates good products from great ones.

By focusing on usability, accessibility, and delight, we can create experiences that not only meet user needs but exceed their expectations. The best products anticipate user needs and remove friction at every step.`,
    author: 'Emily Rodriguez',
    category: 'UX Design',
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=600&fit=crop',
    createdAt: '2026-01-27T09:15:00.000Z',
    updatedAt: '2026-01-27T09:15:00.000Z',
  },
];

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentView, setCurrentView] = useState<'blog' | 'admin' | 'post'>('blog');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load posts, comments, and user state from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem(STORAGE_KEY);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with sample posts
      setPosts(samplePosts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts));
    }

    const savedComments = localStorage.getItem(COMMENTS_KEY);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }

    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
  }, [posts]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }, [comments]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    if (user.role === 'admin') {
      toast.success(`Welcome back, ${user.username}!`);
      setCurrentView('admin');
    } else {
      toast.success(`Welcome, ${user.username}!`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_KEY);
    setCurrentView('blog');
    toast.success('Logged out successfully');
  };

  const handleCreatePost = (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: BlogPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    toast.success('Post created successfully!');
  };

  const handleUpdatePost = (
    id: string,
    postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...postData, id, createdAt: post.createdAt, updatedAt: new Date().toISOString() }
          : post
      )
    );
    toast.success('Post updated successfully!');
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
    // Also delete comments for this post
    setComments(comments.filter((comment) => comment.postId !== id));
    toast.success('Post deleted successfully!');
  };

  const handleAddComment = (postId: string, content: string, parentId: string | null) => {
    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      username: currentUser.username,
      content,
      createdAt: new Date().toISOString(),
      parentId,
    };

    setComments([...comments, newComment]);
    toast.success(parentId ? 'Reply added!' : 'Comment posted!');
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('post');
  };

  const handleNavigateHome = () => {
    setCurrentView('blog');
    setSelectedPost(null);
  };

  const handleNavigateAdmin = () => {
    setCurrentView('admin');
    setSelectedPost(null);
  };

  const handleLoginPrompt = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header
        currentUser={currentUser}
        currentView={currentView}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onNavigateHome={handleNavigateHome}
        onNavigateAdmin={handleNavigateAdmin}
      />

      {currentView === 'blog' && (
        <BlogList posts={posts} onSelectPost={handleSelectPost} />
      )}

      {currentView === 'post' && selectedPost && (
        <BlogPostView 
          post={selectedPost} 
          comments={comments}
          currentUser={currentUser}
          onBack={handleNavigateHome}
          onAddComment={handleAddComment}
          onLoginPrompt={handleLoginPrompt}
        />
      )}

      {currentView === 'admin' && currentUser?.role === 'admin' && (
        <AdminPanel
          posts={posts}
          onCreatePost={handleCreatePost}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}
