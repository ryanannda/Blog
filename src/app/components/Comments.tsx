import { useState } from 'react';
import { Comment, User } from '@/app/types/blog';
import { Button } from '@/app/components/ui/button';
import { Textarea } from '@/app/components/ui/textarea';
import { Card } from '@/app/components/ui/card';
import { MessageCircle, Reply, Send, UserCircle } from 'lucide-react';

interface CommentsProps {
  postId: string;
  comments: Comment[];
  currentUser: User | null;
  onAddComment: (postId: string, content: string, parentId: string | null) => void;
  onLoginPrompt: () => void;
}

export function Comments({
  postId,
  comments,
  currentUser,
  onAddComment,
  onLoginPrompt,
}: CommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Build nested comment structure
  const buildCommentTree = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create a map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build the tree
    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId === null) {
        rootComments.push(commentWithReplies);
      } else {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      }
    });

    return rootComments;
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onAddComment(postId, newComment, null);
    setNewComment('');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return;
    onAddComment(postId, replyContent, parentId);
    setReplyContent('');
    setReplyingTo(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-8 mt-3' : 'mt-4'}`}>
      <Card className={`p-4 ${depth > 0 ? 'bg-gray-50 border-l-2 border-blue-200' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {comment.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{comment.username}</span>
              <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>
            {currentUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyingTo(comment.id);
                  setReplyContent('');
                }}
                className="gap-1 mt-2 h-7 text-xs"
              >
                <Reply className="size-3" />
                Reply
              </Button>
            )}
          </div>
        </div>
      </Card>

      {replyingTo === comment.id && (
        <div className="ml-8 mt-2">
          <div className="flex gap-2">
            <Textarea
              placeholder={`Reply to ${comment.username}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
              className="text-sm"
            />
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => handleSubmitReply(comment.id)}
                disabled={!replyContent.trim()}
              >
                <Send className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );

  const commentTree = buildCommentTree(comments);
  const totalComments = comments.length;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="size-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({totalComments})
        </h2>
      </div>

      {currentUser ? (
        <Card className="p-4 mb-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium flex-shrink-0">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Send className="size-4" />
                Post Comment
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 text-center bg-gray-50 mb-6">
          <UserCircle className="size-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">Sign in to join the discussion</p>
          <Button
            onClick={onLoginPrompt}
            variant="outline"
            className="gap-2"
          >
            <UserCircle className="size-4" />
            Login to Comment
          </Button>
        </Card>
      )}

      {commentTree.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle className="size-12 text-gray-300 mx-auto mb-3" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {commentTree.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
