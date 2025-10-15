import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import Newsletter from "@/components/Newsletter";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import AuthorCard from "@/components/AuthorCard";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { blogPosts, authors } from "@/data/blogPosts";
import heroBg from "@/assets/hero-bg.jpg";
import { TrendingUp } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(blogPosts.map((post) => post.category)));
  
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter((post) => post.featured);
  const trendingPosts = [...blogPosts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  const authorPostCounts = authors.map((author) => ({
    ...author,
    postCount: blogPosts.filter((post) => post.authorId === author.id).length,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-hero opacity-90"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        
        <div className="relative container py-32 md:py-40">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-primary-foreground space-y-8 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                <span className="text-sm font-medium">✨ Welcome to BlogSpace</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                Stories That <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">Inspire</span>
              </h1>
              
              <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                Discover insights on design, productivity, and technology from creators around the world
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="text-lg px-8 hover-scale" asChild>
                  <a href="#newsletter">Start Reading</a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white" asChild>
                  <a href="#contributors">Meet Our Writers</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
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
