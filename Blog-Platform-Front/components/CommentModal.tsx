import React, { useState, useEffect } from "react";
import { X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogId: number | null;
}

const mockComments = [
  {
    id: 1,
    author: "Alice Johnson",
    content: "Great article! Really helpful insights on React development.",
    date: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 2,
    author: "Bob Smith",
    content: "Thanks for sharing this. The TypeScript tips are exactly what I needed.",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

const CommentModal: React.FC<CommentModalProps> = ({ isOpen, onClose, blogId }) => {
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState(sessionStorage.getItem("nickname") || "");
  const [isNicknameSet, setIsNicknameSet] = useState(!!sessionStorage.getItem("nickname"));

  useEffect(() => {
    const storedNickname = sessionStorage.getItem("nickname");
    if (storedNickname) {
      setAuthorName(storedNickname);
      setIsNicknameSet(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || (!isNicknameSet && !authorName.trim())) return;

    if (!isNicknameSet && authorName.trim()) {
      sessionStorage.setItem("nickname", authorName);
      setIsNicknameSet(true);
    }

    const sendData = {
      blogId,
      author: authorName || "Anonymous",
      content: newComment
    };

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData)
      });

      if (res.ok) {
        console.log("Comment created:", sendData);
        setNewComment("");
        setAuthorName(sessionStorage.getItem("nickname") || "");
      } else {
        console.error("Error creating comment");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      onClose();
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorName(e.target.value);
  };

  const formatCommentDate = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b dark:border-gray-800">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Comments
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="max-h-60 overflow-y-auto space-y-4">
            {mockComments.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              mockComments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCommentDate(comment.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 border-t dark:border-gray-800 pt-6">
            {!isNicknameSet && (
              <div className="space-y-2">
                <Label htmlFor="author" className="text-sm font-medium">
                  Your Name *
                </Label>
                <Input
                  id="author"
                  placeholder="Enter your name..."
                  value={authorName}
                  onChange={handleNicknameChange}
                  className="w-full"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-sm font-medium">
                Add a Comment
              </Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full resize-none"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={!newComment.trim() || (!isNicknameSet && !authorName.trim())}
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentModal;