import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Heart,
    MessageCircle,
    Share2,
    Copy,
    Twitter,
    Facebook,
    Linkedin
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface PostInteractionsProps {
    postId: string;
    onCommentClick?: () => void;
}

const PostInteractions = ({ postId, onCommentClick }: PostInteractionsProps) => {
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [sharesCount, setSharesCount] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchCounts = async () => {
        if (!postId) return;

        // Validate that postId looks like a UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(postId)) {
            console.error("Invalid postId format:", postId);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Get likes count - direct query instead of RPC to avoid caching issues
            const { count: likesCount, error: likesError } = await supabase
                .from("likes")
                .select("*", { count: "exact", head: true })
                .eq("post_id", postId);

            if (!likesError && likesCount !== null) {
                setLikesCount(likesCount);
            }

            // Get comments count - direct query instead of RPC
            const { count: commentsCount, error: commentsError } = await supabase
                .from("comments")
                .select("*", { count: "exact", head: true })
                .eq("post_id", postId);

            if (!commentsError && commentsCount !== null) {
                setCommentsCount(commentsCount);
            }

            // Get shares count - direct query instead of RPC
            const { count: sharesCount, error: sharesError } = await supabase
                .from("shares")
                .select("*", { count: "exact", head: true })
                .eq("post_id", postId);

            if (!sharesError && sharesCount !== null) {
                setSharesCount(sharesCount);
            }

            // Check if current user liked the post
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: likedData, error: likedError } = await supabase
                    .from("likes")
                    .select("id")
                    .eq("user_id", user.id)
                    .eq("post_id", postId)
                    .maybeSingle();

                if (!likedError) {
                    setUserLiked(!!likedData);
                }
            }
        } catch (error) {
            console.error("Error fetching interaction counts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("PostInteractions mounted with postId:", postId);
        if (postId) {
            fetchCounts();
        } else {
            console.log("No postId provided to PostInteractions");
            setLoading(false);
        }
    }, [postId]);

    const handleLike = async () => {
        if (!postId) return;

        // Validate that postId looks like a UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(postId)) {
            toast({
                variant: "destructive",
                title: "Error",
                description: `Invalid post ID format: ${postId}`,
            });
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({
                    title: "Authentication required",
                    description: "Please sign in to like posts.",
                });
                return;
            }

            if (userLiked) {
                // Unlike
                const { error } = await supabase
                    .from("likes")
                    .delete()
                    .match({ user_id: user.id, post_id: postId });

                if (error) {
                    console.error("Error unliking post:", error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to unlike post. Please try again.",
                    });
                    return;
                }

                setUserLiked(false);
                setLikesCount(prev => prev - 1);
            } else {
                // Like
                const { error } = await supabase
                    .from("likes")
                    .insert({ user_id: user.id, post_id: postId });

                if (error) {
                    console.error("Error liking post:", error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to like post. Please try again.",
                    });
                    return;
                }

                setUserLiked(true);
                setLikesCount(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error liking post:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to like post. Please try again.",
            });
        }
    };

    const handleShare = async (platform: string) => {
        if (!postId) return;

        // Validate that postId looks like a UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(postId)) {
            toast({
                variant: "destructive",
                title: "Error",
                description: `Invalid post ID format: ${postId}`,
            });
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast({
                    title: "Authentication required",
                    description: "Please sign in to share posts.",
                });
                return;
            }

            // Record the share in the database
            const { error } = await supabase
                .from("shares")
                .insert({ user_id: user.id, post_id: postId, platform });

            if (error) {
                console.error("Error recording share:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to record share. Please try again.",
                });
                return;
            }

            // Update share count
            setSharesCount(prev => prev + 1);

            // Handle platform-specific sharing
            const postUrl = `${window.location.origin}/post/${postId}`;

            switch (platform) {
                case 'copy_link':
                    await navigator.clipboard.writeText(postUrl);
                    toast({
                        title: "Link copied!",
                        description: "The post link has been copied to your clipboard.",
                    });
                    break;
                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`, '_blank');
                    break;
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
                    break;
                case 'linkedin':
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
                    break;
            }

            setIsShareDialogOpen(false);
        } catch (error) {
            console.error("Error sharing post:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to share post. Please try again.",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-4 py-4 border-t border-b border-border">
                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 py-4 border-t border-b border-border">
            <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${userLiked ? 'text-red-500 hover:text-red-600' : ''}`}
                onClick={handleLike}
            >
                <Heart className={`h-4 w-4 ${userLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={onCommentClick}
            >
                <MessageCircle className="h-4 w-4" />
                <span>{commentsCount}</span>
            </Button>

            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                    >
                        <Share2 className="h-4 w-4" />
                        <span>{sharesCount}</span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share this post</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Button
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-3"
                            onClick={() => handleShare('copy_link')}
                        >
                            <Copy className="h-5 w-5" />
                            <span className="text-xs">Copy Link</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-3"
                            onClick={() => handleShare('twitter')}
                        >
                            <Twitter className="h-5 w-5" />
                            <span className="text-xs">Twitter</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-3"
                            onClick={() => handleShare('facebook')}
                        >
                            <Facebook className="h-5 w-5" />
                            <span className="text-xs">Facebook</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-3"
                            onClick={() => handleShare('linkedin')}
                        >
                            <Linkedin className="h-5 w-5" />
                            <span className="text-xs">LinkedIn</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PostInteractions;