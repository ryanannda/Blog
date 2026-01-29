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
      month: "short",
      day: "numeric",
    });
  };

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
        </div>
      )}

      {posts.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="size-12 text-gray-300 mx-auto mb-3" />
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
        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-48 aspect-video sm:aspect-square overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold truncate">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {post.author} • {formatDate(post.createdAt)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPost(post)}
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => setDeletingPost(post)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
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
              Are you sure you want to delete "{deletingPost?.title}"?
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
