import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl py-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">About BlogSpace</h1>
            <p className="text-xl text-muted-foreground">
              A modern platform for sharing ideas and stories
            </p>
          </div>

          <Card className="p-8 bg-gradient-card">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                Welcome to BlogSpace, where creativity meets technology. We're passionate about 
                providing a platform for writers, designers, and thinkers to share their insights 
                with the world.
              </p>
              <p className="text-lg leading-relaxed">
                Our mission is to create a beautiful, distraction-free reading experience that 
                puts content first. We believe that great ideas deserve great presentation, and 
                we've built our platform with that philosophy in mind.
              </p>
              <p className="text-lg leading-relaxed">
                Whether you're here to read about design, productivity, technology, or any other 
                topic, we hope you find inspiration and value in our carefully curated content.
              </p>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <Card className="p-6 text-center bg-gradient-card">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Articles Published</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-card">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Monthly Readers</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-card">
              <div className="text-3xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Contributors</div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
