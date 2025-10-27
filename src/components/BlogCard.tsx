import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Heart, MessageCircle, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

const BlogCard = ({ id, title, excerpt, category, date, readTime, image }: BlogCardProps) => {
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInteractionCounts();
    }
  }, [id]);

  const fetchInteractionCounts = async () => {
    if (!id) return;
    
    try {
      // Get likes count
      const { data: likesData, error: likesError } = await supabase
        .rpc('get_post_likes_count', { post_id: id });
      
      if (!likesError && likesData !== null) {
        setLikesCount(likesData);
      }

      // Get comments count
      const { data: commentsData, error: commentsError } = await supabase
        .rpc('get_post_comments_count', { post_id: id });
      
      if (!commentsError && commentsData !== null) {
        setCommentsCount(commentsData);
      }

      // Get shares count
      const { data: sharesData, error: sharesError } = await supabase
        .rpc('get_post_shares_count', { post_id: id });
      
      if (!sharesError && sharesData !== null) {
        setSharesCount(sharesData);
      }
    } catch (error) {
      console.error("Error fetching interaction counts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/post/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-card h-full flex flex-col">
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-full h-full bg-muted flex items-center justify-center">
                  <span class="text-muted-foreground">Image not available</span>
                </div>
              `;
            }}
          />
        </div>
        <div className="p-6 space-y-3 flex-1 flex flex-col">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{category}</Badge>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 flex-1">
            {excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{commentsCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>{sharesCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;