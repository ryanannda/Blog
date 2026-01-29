import { useState } from "react";
import { BlogPost } from "@/app/types/blog";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Calendar, User, ArrowRight, Sparkles } from "lucide-react";
import { ImageWithFallback } from "@/app/components/Image/ImageWithFallback";
import { SearchBar } from "@/app/components/SearchBar";

interface BlogListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export function BlogList({ posts, onSelectPost }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-8 mb-6">
          <Sparkles className="size-16 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">No Posts Yet</h2>
        <p className="text-gray-600 max-w-md">
          The blog is waiting for its first story. Check back soon for amazing
          content!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Latest Articles
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
          Discover insights, stories, and ideas from our community
        </p>
        <div className="flex justify-center">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search articles by title, content, author, or category..."
          />
        </div>
      </div>

      {searchQuery && (
        <p className="text-center text-gray-600 mb-6">
          Found {filteredPosts.length}{" "}
          {filteredPosts.length === 1 ? "article" : "articles"} matching "
          {searchQuery}"
        </p>
      )}

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <Sparkles className="size-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-md group cursor-pointer"
              onClick={() => onSelectPost(post)}
            >
              <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                <ImageWithFallback
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-3">
                  {post.category}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex flex-col gap-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="size-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-blue-600 group-hover:gap-2 transition-all"
                  >
                    Read
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
