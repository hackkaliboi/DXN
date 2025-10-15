import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";

const CommentSection = () => {
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      toast({
        title: "Comment submitted!",
        description: "Your comment will be visible once approved.",
      });
      setComment("");
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-border">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Comments</h2>
      </div>
      
      <Card className="p-6 bg-gradient-card mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
          />
          <div className="flex justify-end">
            <Button type="submit">Post Comment</Button>
          </div>
        </form>
      </Card>
      
      <p className="text-sm text-muted-foreground text-center">
        Comments will be enabled once backend is integrated
      </p>
    </div>
  );
};

export default CommentSection;