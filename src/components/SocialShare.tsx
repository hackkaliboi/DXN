import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Link as LinkIcon, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare = ({ url, title }: SocialShareProps) => {
  const { toast } = useToast();
  const shareUrl = typeof window !== "undefined" ? window.location.href : url;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "The link has been copied to your clipboard.",
    });
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={shareOnTwitter}>
          <Twitter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={shareOnLinkedIn}>
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={shareOnFacebook}>
          <Facebook className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={copyToClipboard}>
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;