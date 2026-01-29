import { useState, memo } from "react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Card } from "@/app/components/ui/card";
import {
  Reply,
  Send,
  UserCircle,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

/* ================= TYPES ================= */

interface DbComment {
  id: number;
  username: string;
  content: string;
  created_at: string;
  parent_id: number | null;
  replies?: DbComment[];
}

interface CurrentUser {
  id: number;
  username: string;
  role: "admin" | "user";
}

interface CommentsProps {
  comments: DbComment[];
  currentUser: CurrentUser | null;
  onAddComment: (content: string, parentId: string | null) => void;
  onUpdateComment: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
  onLoginPrompt: () => void;
}

/* ================= COMMENT ITEM ================= */

const CommentItem = memo(
  ({
    comment,
    depth,
    currentUser,
    replyingTo,
    setReplyingTo,
    replyContent,
    setReplyContent,

    editingId,
    setEditingId,
    editContent,
    setEditContent,

    openMenuId,
    setOpenMenuId,

    onSubmitReply,
    onUpdateComment,
    onAskDelete,
    formatDate,
  }: {
    comment: DbComment;
    depth: number;
    currentUser: CurrentUser | null;

    replyingTo: number | null;
    setReplyingTo: (id: number | null) => void;
    replyContent: string;
    setReplyContent: (v: string) => void;

    editingId: number | null;
    setEditingId: (id: number | null) => void;
    editContent: string;
    setEditContent: (v: string) => void;

    openMenuId: number | null;
    setOpenMenuId: (id: number | null) => void;

    onSubmitReply: (parentId: number) => void;
    onUpdateComment: (id: number, content: string) => void;
    onAskDelete: (comment: DbComment) => void;

    formatDate: (d: string) => string;
  }) => {
    const isAdmin = currentUser?.role === "admin";
    const isOwner = currentUser?.username === comment.username;

    const canEdit = isAdmin || isOwner;
    const canDelete = isAdmin;

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
              {/* HEADER */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.username}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.created_at)}
                  </span>
                </div>

                {(canEdit || canDelete) && (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === comment.id ? null : comment.id,
                        )
                      }
                    >
                      <MoreVertical className="size-4" />
                    </Button>

                    {openMenuId === comment.id && (
                      <div className="absolute right-0 mt-1 bg-white border rounded shadow-md z-30">
                        {canEdit && (
                          <button
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full"
                            onClick={() => {
                              setEditingId(comment.id);
                              setEditContent(comment.content);
                              setOpenMenuId(null);
                            }}
                          >
                            <Pencil className="size-4" />
                            Edit
                          </button>
                        )}

                        {canDelete && (
                          <button
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                            onClick={() => {
                              onAskDelete(comment);
                              setOpenMenuId(null);
                            }}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CONTENT / EDIT */}
              {editingId === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        onUpdateComment(comment.id, editContent);
                        setEditingId(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}

              {/* REPLY */}
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
                editingId={editingId}
                setEditingId={setEditingId}
                editContent={editContent}
                setEditContent={setEditContent}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                onSubmitReply={onSubmitReply}
                onUpdateComment={onUpdateComment}
                onAskDelete={onAskDelete}
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

/* ================= MAIN ================= */

export function Comments({
  comments,
  currentUser,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onLoginPrompt,
}: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DbComment | null>(null);

  /* BUILD TREE */
  const buildCommentTree = (list: DbComment[]): DbComment[] => {
    const map = new Map<number, DbComment>();
    const roots: DbComment[] = [];

    list.forEach((c) => map.set(c.id, { ...c, replies: [] }));
    list.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parent_id === null) roots.push(node);
      else map.get(c.parent_id!)?.replies?.push(node);
    });

    return roots;
  };

  const commentTree = buildCommentTree(comments || []);

  const handleSubmitReply = (parentId: number) => {
    if (!replyContent.trim()) return;
    onAddComment(replyContent, String(parentId));
    setReplyingTo(null);
    setReplyContent("");
  };

  const formatDate = (d: string) => new Date(d).toLocaleString();

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold mb-6">
        Comments ({comments?.length || 0})
      </h2>

      {/* ADD COMMENT */}
      {currentUser ? (
        <Card className="p-4 mb-6">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button
            className="mt-2"
            onClick={() => {
              if (!newComment.trim()) return;
              onAddComment(newComment, null);
              setNewComment("");
            }}
          >
            <Send className="size-4 mr-2" />
            Post Comment
          </Button>
        </Card>
      ) : (
        <Card className="p-6 text-center">
          <UserCircle className="size-12 mx-auto mb-3" />
          <Button onClick={onLoginPrompt}>Login to Comment</Button>
        </Card>
      )}

      {/* LIST */}
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
          editingId={editingId}
          setEditingId={setEditingId}
          editContent={editContent}
          setEditContent={setEditContent}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          onSubmitReply={handleSubmitReply}
          onUpdateComment={onUpdateComment}
          onAskDelete={setDeleteTarget}
          formatDate={formatDate}
        />
      ))}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Delete Comment</h3>
            <p className="mb-4">
              Are you sure you want to delete the comment from{" "}
              <b>"{deleteTarget.username}"</b>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDeleteComment(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
