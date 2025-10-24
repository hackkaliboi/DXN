import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import Newsletter from "@/components/Newsletter";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import AuthorCard from "@/components/AuthorCard";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { authors } from "@/data/blogPosts";
import heroBg from "@/assets/hero-bg.jpg";
import { TrendingUp } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  slug: string;
  category: string;
  author: string;
  authorId: string;
  date: string;
  readTime: string;
  views: number;
  tags: string[];
  featured?: boolean;
  image: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          categories (name),
          profiles (full_name)
        `)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedPosts: BlogPost[] = (posts || []).map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        cover_image: post.cover_image,
        slug: post.slug,
        category: post.categories?.name || "Uncategorized",
        author: post.profiles?.full_name || "Anonymous",
        authorId: post.author_id,
        date: new Date(post.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        readTime: `${post.reading_time || 5} min read`,
        views: post.views || 0,
        tags: [],
        image: post.cover_image || "",
      }));

      setBlogPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(blogPosts.map((post) => post.category)));

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.slice(0, 2);
  const trendingPosts = [...blogPosts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  const authorPostCounts = authors.map((author) => ({
    ...author,
    postCount: blogPosts.filter((post) => post.authorId === author.id).length,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-hero opacity-95"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/90 dark:from-background/90 dark:via-background/60 dark:to-background/95" />

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-2/3 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative container py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-primary-foreground space-y-8 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 animate-bounce-in">
                <span className="mr-2">✨</span>
                <span className="text-sm font-medium">Welcome to DXN</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-slide-in-up">
                Stories That <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">Inspire</span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed animate-slide-in-up delay-150">
                Discover insights on design, productivity, and technology from creators around the world
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-slide-in-up delay-300">
                <Button
                  size="lg"
                  className="text-base sm:text-lg px-6 sm:px-8 py-6 hover-scale shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  asChild
                >
                  <a href="#newsletter">Start Reading</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 py-6 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  asChild
                >
                  <a href="#contributors">Meet Our Writers</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center p-1">
            <div className="w-2 h-2 bg-white/50 rounded-full animate-scroll-bounce" />
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="container py-16">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Articles</h2>
            <p className="text-lg text-muted-foreground">
              Hand-picked stories worth your time
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Posts Section */}
      <section className="container py-16">
        <div className="mb-8 flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold">Trending Now</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </section>

      {/* All Articles with Search and Filter */}
      <section className="container py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">All Articles</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Explore our complete collection
          </p>

          <div className="space-y-6">
            <SearchBar onSearch={setSearchQuery} />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No articles found matching your search.</p>
          </div>
        )}
      </section>

      {/* Authors Section */}
      <section id="contributors" className="container py-16">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Contributors</h2>
          <p className="text-lg text-muted-foreground">
            Meet the talented writers behind our content
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorPostCounts.map((author) => (
            <AuthorCard key={author.id} {...author} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="container py-16">
        <Newsletter />
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
