import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { authors, blogPosts } from "@/data/blogPosts";
import { User } from "lucide-react";
import { updatePageSEO, generateStructuredData } from "@/utils/seo";

const Author = () => {
  const { id } = useParams();
  const author = authors.find((a) => a.id === id);
  const authorPosts = blogPosts.filter((post) => post.authorId === id);

  useEffect(() => {
    if (author) {
      updatePageSEO({
        title: `${author.name} - Author | BlogSpace`,
        description: author.bio,
        canonical: `${window.location.origin}/author/${author.id}`,
      });

      generateStructuredData("person", {
        name: author.name,
        bio: author.bio,
        id: author.id,
      });
    }
  }, [author]);

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Author not found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        <Breadcrumbs
          items={[
            { label: "Authors", href: "/#contributors" },
            { label: author.name }
          ]}
        />

        <div className="max-w-3xl mx-auto mb-16">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{author.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{author.bio}</p>
              <p className="text-sm text-primary font-medium">
                {authorPosts.length} {authorPosts.length === 1 ? "article" : "articles"} published
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-8">Articles by {author.name}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </div>

        {authorPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No articles yet.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Author;