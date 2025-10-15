import blog1 from "@/assets/blog1.jpg";
import blog2 from "@/assets/blog2.jpg";
import blog3 from "@/assets/blog3.jpg";

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorId: string;
  featured?: boolean;
  views?: number;
}

export const authors: Author[] = [
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    bio: "Design lead with a passion for minimalist aesthetics and user-centered design. 10+ years creating digital experiences."
  },
  {
    id: "michael-chen",
    name: "Michael Chen",
    bio: "Productivity expert and remote work advocate. Helping teams thrive in distributed environments since 2018."
  },
  {
    id: "emma-rodriguez",
    name: "Emma Rodriguez",
    bio: "Tech futurist exploring the intersection of creativity and emerging technologies. AI enthusiast and digital artist."
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Minimalist Design",
    excerpt: "Discover how simplicity and intentional design choices can create powerful user experiences that stand the test of time.",
    content: `Minimalism in design is more than just a trend—it's a philosophy that emphasizes the essential while removing the unnecessary. In today's cluttered digital landscape, minimalist design has become increasingly important for creating experiences that are both beautiful and functional.

The core principles of minimalist design revolve around simplicity, clarity, and purpose. Every element on a page should serve a specific function and contribute to the overall user experience. This doesn't mean that designs should be boring or sterile; rather, it means that every design decision should be intentional and meaningful.

Color plays a crucial role in minimalist design. By limiting the color palette to just a few carefully chosen hues, designers can create visual hierarchy and draw attention to the most important elements. White space, often called negative space, is equally important—it gives the design room to breathe and helps guide the user's eye through the content.

Typography is another key element of minimalist design. Clean, readable fonts that complement the overall aesthetic help maintain the simplicity of the design while ensuring that content remains accessible and easy to consume.

When executed well, minimalist design can create powerful, memorable experiences that resonate with users long after they've left your site.`,
    category: "Design",
    tags: ["UI/UX", "Minimalism", "Web Design"],
    date: "Mar 15, 2024",
    readTime: "5 min read",
    image: blog1,
    author: "Sarah Johnson",
    authorId: "sarah-johnson",
    featured: true,
    views: 1243
  },
  {
    id: "2",
    title: "Productivity Hacks for Remote Workers",
    excerpt: "Learn effective strategies to stay focused and productive while working from home in the modern digital workplace.",
    content: `Remote work has transformed the modern workplace, offering flexibility and freedom while presenting unique challenges. Staying productive in a home environment requires discipline, structure, and the right strategies.

Creating a dedicated workspace is the foundation of remote work success. This doesn't necessarily mean having a separate office—it could be a corner of your living room or a converted closet. The key is having a consistent place where you go to work, which helps your brain switch into "work mode."

Time management techniques like the Pomodoro Technique can be incredibly effective for remote workers. By breaking your work into focused 25-minute sessions with short breaks in between, you can maintain high levels of concentration while avoiding burnout.

Communication becomes even more crucial when working remotely. Over-communicate with your team, use video calls when possible, and don't hesitate to reach out when you need help or clarification. Regular check-ins and updates help maintain team cohesion and ensure everyone stays aligned.

Setting boundaries is essential for maintaining work-life balance. Establish clear working hours and stick to them. When the workday ends, close your laptop and step away from your workspace. This separation helps prevent burnout and maintains your productivity over the long term.

Finally, don't forget to take care of your physical and mental health. Regular exercise, proper nutrition, and adequate sleep are fundamental to sustained productivity and well-being.`,
    category: "Productivity",
    tags: ["Remote Work", "Productivity", "Work-Life Balance"],
    date: "Mar 12, 2024",
    readTime: "7 min read",
    image: blog2,
    author: "Michael Chen",
    authorId: "michael-chen",
    featured: false,
    views: 892
  },
  {
    id: "3",
    title: "The Future of Creative Technology",
    excerpt: "Exploring how AI and emerging technologies are reshaping the creative industry and opening new possibilities for artists.",
    content: `The intersection of creativity and technology has never been more exciting. As artificial intelligence, virtual reality, and other emerging technologies continue to evolve, they're fundamentally changing how we create, consume, and think about art and design.

AI-powered tools are democratizing creative work, making sophisticated design and editing capabilities accessible to everyone. From automated photo editing to AI-generated art, these tools are augmenting human creativity rather than replacing it. The most successful creators are those who learn to work alongside these technologies, using them to enhance their creative vision.

Virtual and augmented reality are opening up entirely new mediums for creative expression. Artists can now create immersive experiences that engage viewers in ways that traditional media never could. These technologies are particularly transformative in fields like architecture, product design, and entertainment.

The rise of NFTs and blockchain technology has created new opportunities for artists to monetize their work and connect directly with collectors. While the technology is still evolving, it's clear that digital ownership and provenance will play an important role in the future of creative work.

However, these technological advances also raise important questions about authenticity, originality, and the role of human creativity. As we move forward, it's crucial that we thoughtfully consider how to use these tools in ways that enhance rather than diminish the human element in creative work.

The future of creative technology is bright, full of possibility and potential. Those who embrace these changes while staying true to their creative vision will be well-positioned to thrive in this new landscape.`,
    category: "Technology",
    tags: ["AI", "Innovation", "Digital Art"],
    date: "Mar 10, 2024",
    readTime: "6 min read",
    image: blog3,
    author: "Emma Rodriguez",
    authorId: "emma-rodriguez",
    featured: true,
    views: 1567
  }
];
