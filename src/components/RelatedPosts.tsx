import { BlogPost } from "@/data/blogPosts";
import BlogCard from "./BlogCard";

interface RelatedPostsProps {
  currentPostId: string;
  posts: BlogPost[];
  limit?: number;
}

const RelatedPosts = ({ currentPostId, posts, limit = 3 }: RelatedPostsProps) => {
  const relatedPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedPosts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;