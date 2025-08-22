import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, BookOpen, Star, Clock } from "lucide-react";
import { WordDefinitionModal } from "./word-definition-modal";
import type { Article } from "@/lib/api";
import type { Language } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
  nativeLanguage: Language;
  userId?: string;
  onReadArticle?: (articleId: string) => void;
}

const levelColors = {
  A1: "bg-green-500",
  A2: "bg-yellow-500", 
  B1: "bg-blue-500",
  B2: "bg-purple-500",
  C1: "bg-red-500",
  C2: "bg-gray-500",
};

export function ArticleCard({ article, nativeLanguage, userId, onReadArticle }: ArticleCardProps) {
  const [selectedWord, setSelectedWord] = useState<string>();
  const [selectedContext, setSelectedContext] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleWordClick = (word: string, context: string) => {
    setSelectedWord(word);
    setSelectedContext(context);
    setIsModalOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const processContentWithDefinitions = (content: string) => {
    const words = content.split(/(\s+|[^\w\s])/);
    
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      const culturalNote = article.culturalNotes[cleanWord];
      
      if (culturalNote) {
        return (
          <span
            key={index}
            className="definable-word"
            onClick={() => handleWordClick(cleanWord, content)}
            data-testid={`definable-word-${cleanWord}`}
          >
            {word}
          </span>
        );
      }
      
      return word;
    });
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200" data-testid={`article-card-${article.id}`}>
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-48 object-cover"
            data-testid="article-image"
          />
        )}
        
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Badge 
                className={`text-white text-xs font-medium ${levelColors[article.difficultyLevel as keyof typeof levelColors] || 'bg-gray-500'}`}
                data-testid="difficulty-badge"
              >
                {article.difficultyLevel}
              </Badge>
              <span className="text-xs text-gray-500 capitalize" data-testid="article-category">
                {article.category}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500" data-testid="read-time">
                  {article.estimatedReadTime} min read
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-xs text-gray-600">4.2</span>
            </div>
          </div>
          
          <h2 
            className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary cursor-pointer transition-colors line-clamp-2"
            onClick={() => onReadArticle?.(article.id)}
            data-testid="article-title"
          >
            {article.title}
          </h2>
          
          <div className="article-content mb-4 text-gray-700 leading-relaxed" data-testid="article-content">
            <p className="line-clamp-3">
              {processContentWithDefinitions(article.content.substring(0, 200) + "...")}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => onReadArticle?.(article.id)}
              className="text-primary hover:text-primary/80 font-medium text-sm p-0"
              data-testid="continue-reading-button"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Continue Reading
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`p-1 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                data-testid="like-button"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-gray-400 hover:text-blue-500 p-1"
                data-testid="share-button"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <WordDefinitionModal
        word={selectedWord}
        context={selectedContext}
        nativeLanguage={nativeLanguage}
        userId={userId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
