import { useState } from "react";
import { BlogPost } from "@/app/types/blog";
import { Card } from "@/app/components/ui/card";
import { SearchBar } from "@/app/components/SearchBar";
import { ImageWithFallback } from "@/app/components/Image/ImageWithFallback";
import { Calendar, User } from "lucide-react";
import { ArrowUpDown } from "lucide-react";

interface BlogListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export function BlogList({ posts, onSelectPost }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  /* ================= FILTER + SORT ================= */

  const filteredPosts = posts
    .filter((post) => {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortOrder === "newest") {
        return dateB - dateA; // Terbaru dulu
      } else {
        return dateA - dateB; // Terlama dulu
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* ================= RENDER ================= */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Latest Articles
        </h2>
        <p className="text-gray-600 mt-2">
          Discover insights, stories, and ideas from our community
        </p>
      </div>

      {/* SEARCH + SORT */}
      <div className="flex items-center gap-3 mb-8 justify-center">
        <div className="w-full sm:max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search"
          />
        </div>

        {/* SORT ICON */}
        <button
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
          className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white shadow-sm hover:bg-gray-50"
          title={
            sortOrder === "newest"
              ? "Sorted by newest (click for oldest)"
              : "Sorted by oldest (click for newest)"
          }
        >
          <ArrowUpDown className="size-4" />
          <span className="text-xs hidden sm:inline">
            {sortOrder === "newest" ? "Newest" : "Oldest"}
          </span>
        </button>
      </div>

      {/* EMPTY STATE */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No articles found.
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => onSelectPost(post)}
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
              {/* CATEGORY */}
              <span className="inline-block mb-2 text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 w-fit">
                {post.category}
              </span>

              {/* TITLE */}
              <h3 className="text-lg font-bold mb-2 line-clamp-2">
                {post.title}
              </h3>

              {/* EXCERPT */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                {post.excerpt}
              </p>

              {/* META */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                <div className="flex items-center gap-1">
                  <User className="size-3" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formatDate(post.createdAt)}
                </div>
              </div>

              {/* READ */}
              <div className="mt-3 text-right">
                <span className="text-blue-600 text-sm font-medium">
                  Read →
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
