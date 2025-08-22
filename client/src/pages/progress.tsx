import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressChart, LevelProgress } from "@/components/ui/progress-chart";
import { api } from "@/lib/api";
import { Newspaper, BookOpen, Flame, Trophy, Target, Lightbulb, ArrowRight } from "lucide-react";

const mockWeeklyData = [
  { day: "Mon", articles: 4, maxArticles: 5 },
  { day: "Tue", articles: 3, maxArticles: 5 },
  { day: "Wed", articles: 5, maxArticles: 5 },
  { day: "Thu", articles: 2, maxArticles: 5 },
  { day: "Fri", articles: 4, maxArticles: 5 },
  { day: "Sat", articles: 3, maxArticles: 5 },
  { day: "Sun", articles: 2, maxArticles: 5 },
];

const achievements = [
  {
    icon: BookOpen,
    title: "Speed Reader",
    description: "Read 5 articles in one day",
    gradient: "from-primary/10 to-primary/5",
    iconColor: "primary",
  },
  {
    icon: Flame,
    title: "Streak Master", 
    description: "20 day learning streak",
    gradient: "from-accent/10 to-accent/5",
    iconColor: "accent",
  },
  {
    icon: BookOpen,
    title: "Vocabulary Builder",
    description: "Learned 100 new words",
    gradient: "from-secondary/10 to-secondary/5", 
    iconColor: "secondary",
  },
  {
    icon: Trophy,
    title: "Culture Explorer",
    description: "Read 10 cultural articles",
    gradient: "from-purple-100 to-purple-50",
    iconColor: "purple-500",
  },
];

export default function Progress() {
  const userId = localStorage.getItem("userId");
  
  const { data: user } = useQuery({
    queryKey: ["/api/users", userId],
    queryFn: () => userId ? api.getUser(userId) : null,
    enabled: !!userId,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["/api/users", userId, "progress"],
    queryFn: () => userId ? api.getUserProgress(userId) : [],
    enabled: !!userId,
  });

  const { data: vocabulary = [] } = useQuery({
    queryKey: ["/api/users", userId, "vocabulary"],
    queryFn: () => userId ? api.getUserVocabulary(userId) : [],
    enabled: !!userId,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">Create an account to track your progress.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Newspaper,
      value: user.totalArticlesRead,
      label: "Articles Read",
      change: "+3 this week",
      changeColor: "green",
    },
    {
      icon: BookOpen,
      value: user.totalWordsLearned,
      label: "Words Learned",
      change: "+127 today",
      changeColor: "blue",
    },
    {
      icon: Flame,
      value: user.streakDays,
      label: "Day Streak",
      change: "Record!",
      changeColor: "orange",
    },
    {
      icon: Trophy,
      value: user.achievements.length,
      label: "Achievements",
      change: "+2 new",
      changeColor: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Progress</h1>
          <p className="text-gray-600">Track your journey to English mastery</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm border border-gray-200" data-testid={`stat-card-${stat.label.toLowerCase().replace(' ', '-')}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <stat.icon className="text-primary text-xl" />
                  </div>
                  <span className={`text-xs bg-${stat.changeColor}-100 text-${stat.changeColor}-700 px-2 py-1 rounded-full`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900" data-testid={`stat-value-${stat.label.toLowerCase().replace(' ', '-')}`}>
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ProgressChart
            title="Weekly Reading Progress"
            data={mockWeeklyData}
          />
          
          <LevelProgress
            currentLevel={user.currentLevel}
            progressPercentage={68}
            nextLevel="B2"
            wordsToNext={1240}
            skills={{
              reading: "B2",
              vocabulary: user.currentLevel,
            }}
          />
        </div>

        {/* Recent Achievements */}
        <Card className="shadow-sm border border-gray-200 mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 bg-gradient-to-r ${achievement.gradient} rounded-lg`}
                  data-testid={`achievement-${achievement.title.toLowerCase().replace(' ', '-')}`}
                >
                  <div className={`w-10 h-10 bg-${achievement.iconColor} rounded-full flex items-center justify-center`}>
                    <achievement.icon className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{achievement.title}</div>
                    <div className="text-xs text-gray-500">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Recommendations */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4" data-testid="focus-area-recommendation">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="text-primary text-sm" />
                  </div>
                  <h4 className="font-medium text-gray-900">Focus Area</h4>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Work on advanced vocabulary to reach B2 level faster
                </p>
                <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium p-0">
                  View Vocabulary Exercises <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4" data-testid="topic-recommendation">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Lightbulb className="text-secondary text-sm" />
                  </div>
                  <h4 className="font-medium text-gray-900">Suggested Topics</h4>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Try reading more business articles to expand professional vocabulary
                </p>
                <Button variant="ghost" className="text-secondary hover:text-secondary/80 text-sm font-medium p-0">
                  Browse Business Articles <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
