import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    }
  };

  return (
    <div className="bg-gradient-card rounded-xl p-6 sm:p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <Mail className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-primary" />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Stay Updated</h2>
        <p className="text-base sm:text-lg text-muted-foreground">
          Get the latest scientific articles and research insights delivered directly to your inbox. No spam, unsubscribe anytime.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" className="w-full sm:w-auto">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;