import { useState, useEffect, useRef } from "react";
import { BlogPost } from "@/app/types/blog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Image, Info } from "lucide-react";

interface BlogPostFormProps {
  post?: BlogPost;
  onSave: (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function BlogPostForm({ post, onSave, onCancel }: BlogPostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    imageUrl: "",
  });
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showImageHelper, setShowImageHelper] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: post.category,
        imageUrl: post.imageUrl,
      });
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInsertImage = () => {
    if (!imageUrlInput.trim()) return;

    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBefore = formData.content.substring(0, cursorPosition);
    const textAfter = formData.content.substring(cursorPosition);

    const imageMarkdown = `![Image](${imageUrlInput})`;
    const newContent = textBefore + imageMarkdown + textAfter;

    setFormData((prev) => ({ ...prev, content: newContent }));
    setImageUrlInput("");
    setShowImageHelper(false);

    setTimeout(() => {
      textarea.focus();
      const newPosition = cursorPosition + imageMarkdown.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        {post ? "Edit Post" : "Create New Post"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter post title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Author name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g., Technology, Lifestyle"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="imageUrl">Featured Image URL *</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              placeholder="Brief summary of the post (1-2 sentences)"
              rows={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="content">Content *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowImageHelper(!showImageHelper)}
                className="gap-2"
              >
                <Image className="size-4" />
                Insert Image
              </Button>
            </div>

            {showImageHelper && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 mb-2">
                <div className="flex items-start gap-2 text-sm text-blue-700">
                  <Info className="size-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Enter an image URL and click "Insert" to add it to your
                    content at the cursor position.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/content-image.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleInsertImage();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleInsertImage}
                    size="sm"
                    disabled={!imageUrlInput.trim()}
                  >
                    Insert
                  </Button>
                </div>
                <p className="text-xs text-gray-600">
                  Images will appear as:{" "}
                  <code className="bg-white px-1 rounded">![Image](url)</code>
                </p>
              </div>
            )}

            <Textarea
              ref={contentTextareaRef}
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Write your post content here... You can use ![Image](url) to add images."
              rows={12}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {post ? "Update Post" : "Create Post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
