import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category_id: string;
  published: boolean;
  featured: boolean;
  [key: string]: any; // Allow additional properties
}

const AdminPost = () => {
  const { id } = useParams();
  const isNewPost = id === "new";
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [loading, setLoading] = useState(!isNewPost);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category_id: "",
    published: false,
    featured: false,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page.",
      });
    }
  }, [isAdmin, adminLoading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      fetchCategories();
      if (!isNewPost) {
        fetchPost();
      }
    }
  }, [isAdmin, id]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setFormData({
        ...formData,
        ...data,
        featured: data.featured || false
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load post.",
      });
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      setFormData({ ...formData, cover_image: publicUrl });
      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload image.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const calculateReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const reading_time = calculateReadingTime(formData.content);

      const postData = {
        ...formData,
        reading_time,
        author_id: user.id,
      };

      if (isNewPost) {
        const { error } = await supabase
          .from("blog_posts")
          .insert([postData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Post created successfully.",
        });
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Post updated successfully.",
        });
      }

      navigate("/admin");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save post.",
      });
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild size="sm">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">
            {isNewPost ? "Create New Post" : "Edit Post"}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter post title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="post-title-slug"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief description of the post"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content</Label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Publish</Label>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? "Saving..." : (isNewPost ? "Create Post" : "Update Post")}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cover Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.cover_image && (
                    <img
                      src={formData.cover_image}
                      alt="Cover"
                      className="w-full h-40 sm:h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-image"
                      disabled={uploadingImage}
                    />
                    <Label
                      htmlFor="cover-image"
                      className="flex items-center justify-center gap-2 cursor-pointer border border-dashed rounded-md p-4 sm:p-6 text-center hover:bg-muted transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminPost;