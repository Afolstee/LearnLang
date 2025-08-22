import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ArticleCard } from "@/components/ui/article-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Language, Level, Category } from "@shared/schema";

const levelOptions = [
  { value: "all", label: "All Levels" },
  { value: "A1", label: "A1 - Beginner" },
  { value: "A2", label: "A2 - Elementary" },
  { value: "B1", label: "B1 - Intermediate" },
  { value: "B2", label: "B2 - Upper Intermediate" },
  { value: "C1", label: "C1 - Advanced" },
  { value: "C2", label: "C2 - Proficient" },
];

const categoryOptions = [
  { value: "all", label: "All Topics" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "culture", label: "Culture" },
  { value: "travel", label: "Travel" },
  { value: "science", label: "Science" },
  { value: "general", label: "General" },
];

export default function Articles() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [limit, setLimit] = useState(10);
  
  const nativeLanguage = (localStorage.getItem("nativeLanguage") || "spanish") as Language;
  const userId = localStorage.getItem("userId");
  const currentLevel = localStorage.getItem("currentLevel") || "A1";

  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ["/api/articles", selectedLevel, selectedCategory, limit],
    queryFn: () => api.getArticles({
      limit,
      offset: 0,
      level: selectedLevel === "all" ? undefined : selectedLevel as Level,
      category: selectedCategory === "all" ? undefined : selectedCategory as Category,
    }),
  });

  const handleReadArticle = (articleId: string) => {
    // Navigate to full article view or open in modal
    console.log("Read article:", articleId);
  };

  const handleLoadMore = () => {
    setLimit(prev => prev + 10);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load articles</h2>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Feed</h1>
            <p className="text-gray-600" data-testid="feed-description">
              Articles curated for your {nativeLanguage} background • {currentLevel} level
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-48" data-testid="level-filter">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48" data-testid="category-filter">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more content.</p>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-8" data-testid="articles-grid">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  nativeLanguage={nativeLanguage}
                  userId={userId || undefined}
                  onReadArticle={handleReadArticle}
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6"
                data-testid="load-more-button"
              >
                <Plus className="mr-2 w-4 h-4" />
                Load More Articles
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
