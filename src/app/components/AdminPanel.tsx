import { useState } from "react";
import { BlogPost } from "@/app/types/blog";
import { BlogPostForm } from "@/app/components/BlogPostForm";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Plus, Edit2, Trash2, FileText } from "lucide-react";
import { ImageWithFallback } from "@/app/components/Image/ImageWithFallback";
import { SearchBar } from "@/app/components/SearchBar";

interface AdminPanelProps {
  posts: BlogPost[];
  onCreatePost: (
    post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
  ) => void;
  onUpdatePost: (
    id: string,
    post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
  ) => void;
  onDeletePost: (id: string) => void;
}

export default function AdminPanel({
  posts,
  onCreatePost,
  onUpdatePost,
  onDeletePost,
}: AdminPanelProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = (
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (editingPost) {
      onUpdatePost(editingPost.id, postData);
      setEditingPost(null);
    } else {
      onCreatePost(postData);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingPost(null);
  };

  const handleDelete = () => {
    if (deletingPost) {
      onDeletePost(deletingPost.id);
      setDeletingPost(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredPosts = posts.filter((post) => {
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q)
    );
  });

  /* ================= FORM MODE ================= */

  if (isCreating || editingPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BlogPostForm
          post={editingPost || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  /* ================= LIST MODE ================= */

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <p className="text-gray-600 mt-1">Manage your blog posts</p>
        </div>

        <Button
          onClick={() => setIsCreating(true)}
          className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
        >
          <Plus className="size-4" />
          New Post
        </Button>
      </div>

      {/* SEARCH */}
      {posts.length > 0 && (
        <div className="mb-8 max-w-xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search posts by title, content, author, or category..."
          />
        </div>
      )}

      {/* EMPTY */}
      {posts.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="size-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Posts Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first blog post to get started
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="size-4 mr-2" />
            Create First Post
          </Button>
        </Card>
      ) : (
        /* === SAME GRID STYLE AS USER PAGE === */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* IMAGE */}
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col h-full">
                <div className="mb-2">
                  <span className="inline-block text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto">
                  <div className="text-xs text-gray-500 mb-4">
                    {post.author} • {formatDate(post.createdAt)}
                  </div>

                  {/* ADMIN ACTIONS (REPLACE READ) */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditingPost(post)}
                    >
                      <Edit2 className="size-4 mr-2" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setDeletingPost(post)}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      <AlertDialog
        open={!!deletingPost}
        onOpenChange={() => setDeletingPost(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <b>"{deletingPost?.title}"</b>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
