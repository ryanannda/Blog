export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  username: string;
  role: 'admin' | 'user';
}

export interface Comment {
  id: string;
  postId: string;
  username: string;
  content: string;
  createdAt: string;
  parentId: string | null; // null for top-level comments, comment id for replies
  replies?: Comment[];
}