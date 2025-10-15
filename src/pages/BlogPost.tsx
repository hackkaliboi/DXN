import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { blogPosts, authors } from "@/data/blogPosts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";
import SocialShare from "@/components/SocialShare";
import RelatedPosts from "@/components/RelatedPosts";
import CommentSection from "@/components/CommentSection";
import BackToTop from "@/components/BackToTop";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Eye, User } from "lucide-react";
import { updatePageSEO, generateStructuredData } from "@/utils/seo";

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);
  const author = post ? authors.find(a => a.id === post.authorId) : null;

  useEffect(() => {
    if (post) {
      updatePageSEO({
        title: `${post.title} | DXN`,
        description: post.excerpt,
        type: "article",
        author: post.author,
        keywords: [post.category, ...post.tags],
        canonical: `${window.location.origin}/post/${post.id}`,
      });

      generateStructuredData("article", {
        title: post.title,
        description: post.excerpt,
        image: post.image,
        datePublished: post.date,
        author: post.author,
      });
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post not found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <Header />
      
      <article className="container max-w-4xl py-12">
        <Breadcrumbs
          items={[
            { label: post.category, href: `/?category=${post.category}` },
            { label: post.title }
          ]}
        />

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{post.category}</Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
            
            <h1 className="text-5xl font-bold leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <Link 
                to={`/author/${post.authorId}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="font-medium">{post.author}</span>
              </Link>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              {post.views && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
              )}
            </div>

            <SocialShare url={`/post/${post.id}`} title={post.title} />
          </div>

          <div className="aspect-[21/9] overflow-hidden rounded-xl">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none pt-8">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-foreground/90 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {author && (
            <div className="mt-12 p-6 border border-border rounded-xl bg-gradient-card">
              <h3 className="text-lg font-bold mb-3">About the Author</h3>
              <Link 
                to={`/author/${author.id}`}
                className="flex items-start gap-4 hover:opacity-80 transition-opacity"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">{author.name}</p>
                  <p className="text-sm text-muted-foreground">{author.bio}</p>
                </div>
              </Link>
            </div>
          )}

          <CommentSection />
        </div>

        <RelatedPosts currentPostId={post.id} posts={blogPosts} />
      </article>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default BlogPost;
