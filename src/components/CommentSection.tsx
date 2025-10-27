import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          profiles (full_name, avatar_url)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load comments. Please refresh the page.",
        });
        return;
      }
      
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load comments. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !postId) return;

    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to post comments.",
        });
        return;
      }

      const { error } = await supabase
        .from("comments")
        .insert({
          user_id: user.id,
          post_id: postId,
          content: comment.trim()
        });

      if (error) {
        console.error("Error posting comment:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to post comment. Please try again.",
        });
        return;
      }

      toast({
        title: "Comment posted!",
        description: "Your comment is now visible.",
      });

      setComment("");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post comment. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      <Card className="p-6 bg-gradient-card mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
            disabled={submitting}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center">Loading comments...</p>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-6">
              <div className="flex gap-4">
                {comment.profiles?.avatar_url ? (
                  <img
                    src={comment.profiles.avatar_url}
                    alt={comment.profiles.full_name || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">
                      {comment.profiles?.full_name || "Anonymous User"}
                    </h4>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
};

export default CommentSection;