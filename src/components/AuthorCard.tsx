import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface AuthorCardProps {
  id: string;
  name: string;
  bio: string;
  postCount?: number;
  avatar?: string;
}

const AuthorCard = ({ id, name, bio, postCount, avatar }: AuthorCardProps) => {
  return (
    <Link to={`/author/${id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-card h-full">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{bio}</p>
            {postCount !== undefined && (
              <p className="text-xs text-primary font-medium">
                {postCount} {postCount === 1 ? "article" : "articles"}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default AuthorCard;