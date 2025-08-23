import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProgressSchema, insertVocabularySchema, LanguageEnum, LevelEnum, CategoryEnum } from "@shared/schema";
import { defineWord, adaptArticle, generateComprehensionQuestions } from "./services/openai";
import { translateToNativeLanguage } from "./services/translate";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User management
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error: (error as Error).message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error: (error as Error).message });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error: (error as Error).message });
    }
  });

  // Articles
  app.get("/api/articles", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const category = req.query.category as string;
      const level = req.query.level as string;

      const articles = await storage.getArticles(limit, offset, category, level);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles", error: (error as Error).message });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticle(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article", error: (error as Error).message });
    }
  });

  // Word definitions
  app.post("/api/define", async (req, res) => {
    try {
      const schema = z.object({
        word: z.string().min(1),
        nativeLanguage: LanguageEnum,
        context: z.string().optional(),
      });

      const { word, nativeLanguage, context } = schema.parse(req.body);
      const definition = await defineWord(word, nativeLanguage, context);
      res.json(definition);
    } catch (error) {
      res.status(500).json({ message: "Failed to define word", error: (error as Error).message });
    }
  });

  // Vocabulary management
  app.post("/api/vocabulary", async (req, res) => {
    try {
      const vocabularyData = insertVocabularySchema.parse(req.body);
      const vocabulary = await storage.createVocabulary(vocabularyData);
      res.json(vocabulary);
    } catch (error) {
      res.status(400).json({ message: "Invalid vocabulary data", error: (error as Error).message });
    }
  });

  app.get("/api/users/:userId/vocabulary", async (req, res) => {
    try {
      const vocabulary = await storage.getUserVocabulary(req.params.userId);
      res.json(vocabulary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vocabulary", error: (error as Error).message });
    }
  });

  // User progress
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(progressData);
      
      // Update user stats
      const user = await storage.getUser(progressData.userId);
      if (user) {
        await storage.updateUser(progressData.userId, {
          totalArticlesRead: user.totalArticlesRead + 1,
          totalWordsLearned: user.totalWordsLearned + (progressData.wordsLearned as string[]).length,
        });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data", error: (error as Error).message });
    }
  });

  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress", error: (error as Error).message });
    }
  });

  // Article adaptation
  app.post("/api/adapt-article", async (req, res) => {
    try {
      const schema = z.object({
        text: z.string().min(1),
        targetLevel: LevelEnum,
        nativeLanguage: LanguageEnum,
      });

      const { text, targetLevel, nativeLanguage } = schema.parse(req.body);
      const adaptedArticle = await adaptArticle(text, targetLevel, nativeLanguage);
      
      // Save the adapted article
      const article = await storage.createArticle({
        title: adaptedArticle.title,
        content: adaptedArticle.content,
        summary: adaptedArticle.summary,
        category: "general",
        difficultyLevel: adaptedArticle.difficultyLevel,
        estimatedReadTime: adaptedArticle.estimatedReadTime,
        imageUrl: "",
        tags: [],
        culturalNotes: adaptedArticle.culturalNotes,
      });
      
      res.json({ ...article, comprehensionQuestions: adaptedArticle.comprehensionQuestions });
    } catch (error) {
      res.status(500).json({ message: "Failed to adapt article", error: (error as Error).message });
    }
  });

  // Comprehension questions
  app.post("/api/comprehension-questions", async (req, res) => {
    try {
      const schema = z.object({
        articleContent: z.string().min(1),
        difficultyLevel: LevelEnum,
      });

      const { articleContent, difficultyLevel } = schema.parse(req.body);
      const questions = await generateComprehensionQuestions(articleContent, difficultyLevel);
      res.json({ questions });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate questions", error: (error as Error).message });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}
