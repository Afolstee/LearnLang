import { apiRequest } from "./queryClient";
import type { Language, Level, Category } from "@shared/schema";

export interface WordDefinition {
  word: string;
  definition: string;
  culturalContext: string;
  nativeTranslation: string;
  exampleSentence: string;
}

export interface User {
  id: string;
  username: string;
  nativeLanguage: string;
  currentLevel: string;
  streakDays: number;
  totalWordsLearned: number;
  totalArticlesRead: number;
  achievements: string[];
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  difficultyLevel: string;
  estimatedReadTime: number;
  imageUrl?: string;
  tags: string[];
  culturalNotes: Record<string, string>;
  createdAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  articleId: string;
  completedAt: string;
  wordsLearned: string[];
  comprehensionScore?: number;
}

export const api = {
  // User operations
  async createUser(userData: { username: string; nativeLanguage: Language; currentLevel: Level }) {
    const response = await apiRequest("POST", "/api/users", userData);
    return response.json() as Promise<User>;
  },

  async getUser(id: string) {
    const response = await apiRequest("GET", `/api/users/${id}`);
    return response.json() as Promise<User>;
  },

  async updateUser(id: string, updates: Partial<User>) {
    const response = await apiRequest("PATCH", `/api/users/${id}`, updates);
    return response.json() as Promise<User>;
  },

  // Article operations
  async getArticles(params?: { 
    limit?: number; 
    offset?: number; 
    category?: Category; 
    level?: Level;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.offset) queryParams.set("offset", params.offset.toString());
    if (params?.category) queryParams.set("category", params.category);
    if (params?.level) queryParams.set("level", params.level);
    
    const response = await apiRequest("GET", `/api/articles?${queryParams.toString()}`);
    return response.json() as Promise<Article[]>;
  },

  async getArticle(id: string) {
    const response = await apiRequest("GET", `/api/articles/${id}`);
    return response.json() as Promise<Article>;
  },

  // Word definitions
  async defineWord(word: string, nativeLanguage: Language, context?: string) {
    const response = await apiRequest("POST", "/api/define", {
      word,
      nativeLanguage,
      context,
    });
    return response.json() as Promise<WordDefinition>;
  },

  // Vocabulary
  async saveVocabulary(vocabularyData: {
    userId: string;
    word: string;
    definition: string;
    culturalContext?: string;
    nativeTranslation?: string;
    exampleSentence?: string;
  }) {
    const response = await apiRequest("POST", "/api/vocabulary", vocabularyData);
    return response.json();
  },

  async getUserVocabulary(userId: string) {
    const response = await apiRequest("GET", `/api/users/${userId}/vocabulary`);
    return response.json();
  },

  // Progress tracking
  async saveProgress(progressData: {
    userId: string;
    articleId: string;
    wordsLearned: string[];
    comprehensionScore?: number;
  }) {
    const response = await apiRequest("POST", "/api/progress", progressData);
    return response.json() as Promise<UserProgress>;
  },

  async getUserProgress(userId: string) {
    const response = await apiRequest("GET", `/api/users/${userId}/progress`);
    return response.json() as Promise<UserProgress[]>;
  },

  // Content adaptation
  async adaptArticle(text: string, targetLevel: Level, nativeLanguage: Language) {
    const response = await apiRequest("POST", "/api/adapt-article", {
      text,
      targetLevel,
      nativeLanguage,
    });
    return response.json();
  },

  async generateQuestions(articleContent: string, difficultyLevel: Level) {
    const response = await apiRequest("POST", "/api/comprehension-questions", {
      articleContent,
      difficultyLevel,
    });
    return response.json();
  },
};
