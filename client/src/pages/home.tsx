import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, MousePointer, BarChart3, Globe, Rocket } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Language, Level } from "@shared/schema";

const languages = [
  {
    code: "spanish" as Language,
    name: "Español",
    englishName: "Spanish",
    flag: "ES",
    gradient: "from-red-500 to-yellow-500",
    learners: "2.3M learners",
  },
  {
    code: "french" as Language,
    name: "Français", 
    englishName: "French",
    flag: "FR",
    gradient: "from-blue-600 to-blue-400",
    learners: "1.8M learners",
  },
  {
    code: "mandarin" as Language,
    name: "中文",
    englishName: "Mandarin",
    flag: "中",
    gradient: "from-red-600 to-yellow-500",
    learners: "3.1M learners",
  },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Content",
    description: "Articles adapted to your level and cultural background",
    color: "primary",
  },
  {
    icon: MousePointer,
    title: "Click-to-Define",
    description: "Instant definitions and cultural context for any word",
    color: "secondary",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor your learning journey and achievements",
    color: "accent",
  },
  {
    icon: Globe,
    title: "Cultural Bridge",
    description: "Learn concepts through your cultural lens",
    color: "success",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: (userData: { username: string; nativeLanguage: Language; currentLevel: Level }) =>
      api.createUser(userData),
    onSuccess: (user) => {
      localStorage.setItem("userId", user.id);
      localStorage.setItem("nativeLanguage", user.nativeLanguage);
      localStorage.setItem("currentLevel", user.currentLevel);
      toast({
        title: "Welcome to LinguaLearn!",
        description: "Your learning journey has begun.",
      });
      setLocation("/articles");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleStartLearning = () => {
    if (!selectedLanguage) {
      toast({
        title: "Please select a language",
        description: "Choose your native language to continue.",
        variant: "destructive",
      });
      return;
    }

    // Generate a temporary username
    const username = `learner_${Date.now()}`;
    
    createUserMutation.mutate({
      username,
      nativeLanguage: selectedLanguage,
      currentLevel: "A1",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Diverse students learning together"
              className="rounded-xl shadow-lg w-full h-64 object-cover"
              data-testid="hero-image"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Master English with{" "}
            <span className="text-primary">Smart Content</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Learn English through personalized articles adapted to your native language and skill level
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Choose Your Native Language
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {languages.map((language) => (
              <Card
                key={language.code}
                className={`language-card cursor-pointer border-2 transition-all duration-300 hover:shadow-lg ${
                  selectedLanguage === language.code
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary"
                }`}
                onClick={() => handleLanguageSelect(language.code)}
                data-testid={`language-card-${language.code}`}
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${language.gradient} rounded-full flex items-center justify-center text-white text-2xl font-bold`}
                    >
                      {language.flag}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {language.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">{language.englishName}</p>
                    <div className="mt-4 text-xs text-gray-500">
                      <span data-testid={`learner-count-${language.code}`}>
                        {language.learners}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-sm">
              <CardContent className="p-6">
                <div className={`w-12 h-12 bg-${feature.color}/10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`text-${feature.color} text-xl`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={handleStartLearning}
            disabled={createUserMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            data-testid="start-learning-button"
          >
            <Rocket className="mr-2" />
            {createUserMutation.isPending ? "Starting..." : "Start Learning Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
