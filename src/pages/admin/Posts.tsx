import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    published: boolean;
    created_at: string;
    views: number;
    category_id: string;
    categories: { name: string } | null;
}

const Posts = () => {
    const { isAdmin, loading: adminLoading } = useAdmin();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (!adminLoading && !isAdmin) {
            navigate("/");
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You don't have permission to access the admin panel.",
            });
        }
    }, [isAdmin, adminLoading, navigate, toast]);

    useEffect(() => {
        if (isAdmin) {
            fetchPosts();
        }
    }, [isAdmin]);

    const fetchPosts = async () => {
        try {
            const { data, error } = await supabase
                .from("blog_posts")
                .select(`
          id,
          title,
          excerpt,
          published,
          created_at,
          views,
          category_id,
          categories (name)
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load posts.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const { error } = await supabase
                .from("blog_posts")
                .delete()
                .eq("id", deleteId);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Post deleted successfully.",
            });
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete post.",
            });
        } finally {
            setDeleteId(null);
        }
    };

    // Show loading state when checking admin status
    if (adminLoading) {
        return null;
    }

    // Show nothing if not admin
    if (!isAdmin) {
        return null;
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Posts</h1>
                        <p className="text-muted-foreground">Manage your blog posts</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link to="/admin/post/new">
                            <Plus className="h-4 w-4 mr-2" />
                            New Post
                        </Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground mb-4">No posts yet. Create your first post!</p>
                            <Button asChild>
                                <Link to="/admin/post/new">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Post
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {posts.map((post) => (
                            <Card key={post.id}>
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <CardTitle className="text-xl">{post.title}</CardTitle>
                                                {post.published ? (
                                                    <Badge variant="default">Published</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Draft</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <span>{post.categories?.name}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {post.views} views
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                asChild
                                            >
                                                <Link to={`/admin/post/${post.id}`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setDeleteId(post.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the post.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
};

export default Posts;