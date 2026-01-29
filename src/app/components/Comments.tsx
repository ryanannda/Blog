import { useState, memo } from "react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Card } from "@/app/components/ui/card";
import { MessageCircle, Reply, Send, UserCircle } from "lucide-react";

/* ================= TYPES ================= */

interface DbComment {
  id: number;
  username: string;
  content: string;
  created_at: string;
  parent_id: number | null;
  replies?: DbComment[];
}

interface CommentsProps {
  comments: DbComment[];
  currentUser: { username: string } | null;
  onAddComment: (content: string, parentId: string | null) => void;
  onLoginPrompt: () => void;
}

/* ================= COMMENT ITEM (MEMOIZED) ================= */

const CommentItem = memo(
  ({
    comment,
    depth,
    currentUser,
    replyingTo,
    setReplyingTo,
    replyContent,
    setReplyContent,
    onSubmitReply,
    formatDate,
  }: {
    comment: DbComment;
    depth: number;
    currentUser: { username: string } | null;
    replyingTo: number | null;
    setReplyingTo: (id: number | null) => void;
    replyContent: string;
    setReplyContent: (v: string) => void;
    onSubmitReply: (parentId: number) => void;
    formatDate: (d: string) => string;
  }) => {
    return (
      <div className={`${depth > 0 ? "ml-8 mt-3" : "mt-4"}`}>
        <Card
          className={`p-4 ${
            depth > 0 ? "bg-gray-50 border-l-2 border-blue-200" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
              {comment.username.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.username}</span>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.created_at)}
                </span>
              </div>

              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>

              {currentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(comment.id)}
                  className="gap-1 mt-2 h-7 text-xs"
                >
                  <Reply className="size-3" />
                  Reply
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* REPLY FORM */}
        {replyingTo === comment.id && (
          <div className="ml-8 mt-2">
            <div className="flex gap-2">
              <Textarea
                key={comment.id} // 🔥 prevent remount focus bug
                placeholder={`Reply to ${comment.username}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
              />
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={() => onSubmitReply(comment.id)}>
                  <Send className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* REPLIES */}
        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                currentUser={currentUser}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                onSubmitReply={onSubmitReply}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

CommentItem.displayName = "CommentItem";

/* ================= MAIN COMPONENT ================= */

export function Comments({
  comments,
  currentUser,
  onAddComment,
  onLoginPrompt,
}: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  /* ================= BUILD TREE ================= */

  const buildCommentTree = (list: DbComment[]): DbComment[] => {
    const map = new Map<number, DbComment>();
    const roots: DbComment[] = [];

    list.forEach((c) => {
      map.set(c.id, { ...c, replies: [] });
    });

    list.forEach((c) => {
      const node = map.get(c.id)!;

      if (c.parent_id === null) {
        roots.push(node);
      } else {
        const parent = map.get(c.parent_id);
        if (parent) {
          parent.replies!.push(node);
        }
      }
    });

    return roots;
  };

  const commentTree = buildCommentTree(comments || []);

  /* ================= ACTIONS ================= */

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment, null);
    setNewComment("");
  };

  const handleSubmitReply = (parentId: number) => {
    if (!replyContent.trim()) return;
    onAddComment(replyContent, String(parentId));
    setReplyingTo(null);
    setReplyContent("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  /* ================= RENDER ================= */

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="size-6 text-blue-500" />
        <h2 className="text-2xl font-bold">
          Comments ({comments?.length || 0})
        </h2>
      </div>

      {/* ADD COMMENT */}
      {currentUser ? (
        <Card className="p-4 mb-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
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
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600"
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
          <Button onClick={onLoginPrompt} variant="outline">
            Login to Comment
          </Button>
        </Card>
      )}

      {/* LIST */}
      {commentTree.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle className="size-12 text-gray-300 mx-auto mb-3" />
          <p>No comments yet. Be the first!</p>
        </div>
      ) : (
        <div>
          {commentTree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              currentUser={currentUser}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmitReply={handleSubmitReply}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
