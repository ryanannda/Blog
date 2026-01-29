import { useState, useEffect } from "react";
import { BlogPost, User } from "@/app/types/blog";
import { Header } from "@/app/components/Header";
import { LoginModal } from "@/app/components/LoginModal";
import { BlogList } from "@/app/components/BlogList";
import { BlogPostView } from "@/app/components/BlogPostView";
import AdminPanel from "@/app/components/AdminPanel";
import { Toaster } from "@/app/components/ui/sonner";
import { toast } from "sonner";

const API = "http://localhost:5000/api";
const USER_KEY = "miniblog_user";

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentView, setCurrentView] = useState<"blog" | "admin" | "post">(
    "blog",
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  /* ================= LOAD POSTS FROM BACKEND ================= */

  const loadPosts = async () => {
    try {
      const res = await fetch(`${API}/posts`);
      const data = await res.json();

      const mapped: BlogPost[] = data.map((p: any) => ({
        id: String(p.id),
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        imageUrl: p.featured_image,
        author: p.author_name,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      }));

      setPosts(mapped);
    } catch (err) {
      console.error("Failed to load posts", err);
      toast.error("Failed to load posts from server");
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    loadPosts();

    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  /* ================= AUTH ================= */

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    if (user.role === "admin") {
      toast.success(`Welcome back, ${user.username}!`);
      setCurrentView("admin");
    } else {
      toast.success(`Welcome, ${user.username}!`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_KEY);
    setCurrentView("blog");
    toast.success("Logged out successfully");
  };

  /* ================= POSTS CRUD (BACKEND) ================= */

  const handleCreatePost = async (
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
  ) => {
    const payload = {
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      category: postData.category,
      featured_image: postData.imageUrl,
      author_name: postData.author,
    };

    try {
      await fetch(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await loadPosts();
      toast.success("Post created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post");
    }
  };

  const handleUpdatePost = async (
    id: string,
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
  ) => {
    const payload = {
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      category: postData.category,
      featured_image: postData.imageUrl,
      author_name: postData.author,
    };

    try {
      await fetch(`${API}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await loadPosts();
      toast.success("Post updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post");
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await fetch(`${API}/posts/${id}`, {
        method: "DELETE",
      });

      await loadPosts();
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  /* ================= NAVIGATION ================= */

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView("post");
  };

  const handleNavigateHome = () => {
    setCurrentView("blog");
    setSelectedPost(null);
  };

  const handleNavigateAdmin = () => {
    setCurrentView("admin");
    setSelectedPost(null);
  };

  const handleLoginPrompt = () => {
    setShowLoginModal(true);
  };

  /* ================= RENDER ================= */

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

      {currentView === "blog" && (
        <BlogList posts={posts} onSelectPost={handleSelectPost} />
      )}

      {currentView === "post" && selectedPost && (
        <BlogPostView
          post={selectedPost}
          currentUser={currentUser}
          onBack={handleNavigateHome}
          onLoginPrompt={handleLoginPrompt}
        />
      )}

      {currentView === "admin" && currentUser?.role === "admin" && (
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
