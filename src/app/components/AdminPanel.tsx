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

export function AdminPanel({
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
      month: "short",
      day: "numeric",
    });
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  });

  if (isCreating || editingPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogPostForm
          post={editingPost || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <p className="text-gray-600 mt-1">Manage your blog posts</p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="size-4" />
          New Post
        </Button>
      </div>

      {posts.length > 0 && (
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search posts by title, content, author, or category..."
          />
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Found {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "post" : "posts"} matching "
              {searchQuery}"
            </p>
          )}
        </div>
      )}

      {posts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-6 inline-block mb-4">
            <FileText className="size-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Posts Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first blog post to get started
          </p>
          <Button
            onClick={() => setIsCreating(true)}
            className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="size-4" />
            Create First Post
          </Button>
        </Card>
      ) : filteredPosts.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="size-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No posts found
          </h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-48 aspect-video sm:aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0">
                  <ImageWithFallback
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPost(post)}
                        className="gap-1"
                      >
                        <Edit2 className="size-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeletingPost(post)}
                        className="gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="size-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deletingPost}
        onOpenChange={() => setDeletingPost(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingPost?.title}"? This
              action cannot be undone.
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
