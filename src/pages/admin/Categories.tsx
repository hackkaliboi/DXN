import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

const Categories = () => {
    const { isAdmin, loading: adminLoading } = useAdmin();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "" });
    const { toast } = useToast();

    useEffect(() => {
        if (isAdmin) {
            fetchCategories();
        }
    }, [isAdmin]);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .order("name");

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch categories.",
            });
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name),
        });
    };

    const resetForm = () => {
        setFormData({ name: "", slug: "" });
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCategory) {
                // Update existing category
                const { error } = await supabase
                    .from("categories")
                    .update({ name: formData.name, slug: formData.slug })
                    .eq("id", editingCategory.id);

                if (error) throw error;

                toast({
                    title: "Success",
                    description: "Category updated successfully.",
                });
            } else {
                // Create new category
                const { error } = await supabase
                    .from("categories")
                    .insert([{ name: formData.name, slug: formData.slug }]);

                if (error) throw error;

                toast({
                    title: "Success",
                    description: "Category created successfully.",
                });
            }

            resetForm();
            setIsDialogOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to ${editingCategory ? "update" : "create"} category.`,
            });
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, slug: category.slug });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            // Check if category is used by any posts
            const { data: posts, error: postsError } = await supabase
                .from("blog_posts")
                .select("id")
                .eq("category_id", id)
                .limit(1);

            if (postsError) throw postsError;

            if (posts && posts.length > 0) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Cannot delete category that is assigned to posts.",
                });
                return;
            }

            const { error } = await supabase
                .from("categories")
                .delete()
                .eq("id", id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Category deleted successfully.",
            });

            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete category.",
            });
        }
    };

    // Show loading state when checking admin status
    if (adminLoading) {
        return (
            <AdminLayout>
                <div className="container py-16 text-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </AdminLayout>
        );
    }

    // Show nothing if not admin
    if (!isAdmin) {
        return null;
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Categories</h1>
                        <p className="text-muted-foreground">Manage post categories</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingCategory ? "Edit Category" : "Add New Category"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Category name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="category-slug"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsDialogOpen(false);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingCategory ? "Update" : "Create"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Category List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="py-8 text-center">
                                <p className="text-muted-foreground">Loading categories...</p>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-muted-foreground">No categories found.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>{category.slug}</TableCell>
                                            <TableCell>
                                                {new Date(category.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(category)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(category.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Categories;