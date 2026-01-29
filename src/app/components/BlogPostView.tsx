import { BlogPost, User } from "@/app/types/blog";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Calendar, User as UserIcon, Tag } from "lucide-react";
import { ImageWithFallback } from "@/app/components/Image/ImageWithFallback";
import { Comments } from "@/app/components/Comments";
import { useEffect, useState } from "react";

interface BlogPostViewProps {
  post: BlogPost;
  currentUser: User | null;
  onBack: () => void;
  onLoginPrompt: () => void;
}

const API = "http://localhost:5000/api";

export function BlogPostView({
  post,
  currentUser,
  onBack,
  onLoginPrompt,
}: BlogPostViewProps) {
  const [comments, setComments] = useState<any[]>([]);

  /* ================= LOAD COMMENTS FROM BACKEND ================= */

  const loadComments = async () => {
    try {
      const res = await fetch(`${API}/posts/${post.id}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [post.id]);

  /* ================= ADD COMMENT / REPLY ================= */

  const handleAddComment = async (content: string, parentId: string | null) => {
    if (!currentUser) {
      onLoginPrompt();
      return;
    }

    try {
      await fetch(`${API}/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.username === "admin" ? 1 : 2,
          content,
          parent_id: parentId,
        }),
      });

      await loadComments();
    } catch (err) {
      console.error("Failed to add comment", err);
      alert("Failed to add comment");
    }
  };

  /* ================= UTILS ================= */

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Parse content to extract images and text
  const parseContent = (content: string) => {
    const parts: Array<{
      type: "text" | "image";
      content: string;
      alt?: string;
    }> = [];

    const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = imagePattern.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = content.substring(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push({ type: "text", content: textBefore });
        }
      }

      parts.push({
        type: "image",
        content: match[2],
        alt: match[1] || "Content image",
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      if (remainingText.trim()) {
        parts.push({ type: "text", content: remainingText });
      }
    }

    return parts;
  };

  const contentParts = parseContent(post.content);

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2 hover:gap-3 transition-all"
        >
          <ArrowLeft className="size-4" />
          Back to Articles
        </Button>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="aspect-video sm:aspect-[21/9] overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
            <ImageWithFallback
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1 font-medium text-gray-900">
                    <UserIcon className="size-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Calendar className="size-3" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <Tag className="size-3" />
                {post.category}
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 pb-8 border-b border-gray-200 italic">
              {post.excerpt}
            </p>

            <div className="prose prose-lg max-w-none">
              {contentParts.map((part, index) => {
                if (part.type === "image") {
                  return (
                    <div
                      key={index}
                      className="my-8 rounded-xl overflow-hidden shadow-md"
                    >
                      <ImageWithFallback
                        src={part.content}
                        alt={part.alt || "Content image"}
                        className="w-full h-auto"
                      />
                    </div>
                  );
                } else {
                  return part.content.split("\n").map((paragraph, pIndex) =>
                    paragraph.trim() ? (
                      <p
                        key={`${index}-${pIndex}`}
                        className="text-gray-700 mb-4 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ) : null,
                  );
                }
              })}
            </div>

            {/* COMMENTS (FROM POSTGRESQL) */}
            <Comments
              comments={comments}
              currentUser={currentUser}
              onAddComment={handleAddComment}
              onLoginPrompt={onLoginPrompt}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
