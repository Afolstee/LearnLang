import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressData {
  day: string;
  articles: number;
  maxArticles: number;
}

interface ProgressChartProps {
  title: string;
  data: ProgressData[];
}

export function ProgressChart({ title, data }: ProgressChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = (item.articles / item.maxArticles) * 100;
            
            return (
              <div key={index} className="flex items-center justify-between" data-testid={`progress-day-${item.day}`}>
                <span className="text-sm text-gray-600 w-12">{item.day}</span>
                <div className="flex-1 mx-3">
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    data-testid={`progress-bar-${item.day}`}
                  />
                </div>
                <span className="text-sm font-medium w-16 text-right" data-testid={`progress-count-${item.day}`}>
                  {item.articles} articles
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface LevelProgressProps {
  currentLevel: string;
  progressPercentage: number;
  nextLevel: string;
  wordsToNext: number;
  skills: {
    reading: string;
    vocabulary: string;
  };
}

export function LevelProgress({ 
  currentLevel, 
  progressPercentage, 
  nextLevel, 
  wordsToNext,
  skills 
}: LevelProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Level Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700" data-testid="current-level">
                Current Level: {currentLevel} Intermediate
              </span>
              <span className="text-sm text-gray-500" data-testid="progress-to-next">
                {progressPercentage}% to {nextLevel}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" data-testid="level-progress-bar" />
            <p className="text-xs text-gray-500 mt-2" data-testid="words-to-next">
              {wordsToNext} more words to reach {nextLevel}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg" data-testid="reading-skill">
              <div className="text-2xl font-bold text-primary">{skills.reading}</div>
              <div className="text-sm text-gray-600">Reading</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg" data-testid="vocabulary-skill">
              <div className="text-2xl font-bold text-secondary">{skills.vocabulary}</div>
              <div className="text-sm text-gray-600">Vocabulary</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
