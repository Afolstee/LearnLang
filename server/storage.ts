import { users, articles, userProgress, vocabulary, type User, type InsertUser, type Article, type InsertArticle, type UserProgress, type InsertUserProgress, type Vocabulary, type InsertVocabulary } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Article operations
  getArticles(limit?: number, offset?: number, category?: string, level?: string): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  
  // User progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Vocabulary operations
  getUserVocabulary(userId: string): Promise<Vocabulary[]>;
  createVocabulary(vocabulary: InsertVocabulary): Promise<Vocabulary>;
  updateVocabulary(id: string, updates: Partial<Vocabulary>): Promise<Vocabulary | undefined>;
}


// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        currentLevel: insertUser.currentLevel || "A1",
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getArticles(limit = 10, offset = 0, category?: string, level?: string): Promise<Article[]> {
    const conditions = [];
    
    if (category) {
      conditions.push(eq(articles.category, category));
    }
    if (level) {
      conditions.push(eq(articles.difficultyLevel, level));
    }
    
    let query = db.select().from(articles);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const result = await query
      .limit(limit)
      .offset(offset)
      .orderBy(desc(articles.createdAt));
    
    return result;
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values({
        ...insertArticle,
        imageUrl: insertArticle.imageUrl || null,
        tags: insertArticle.tags || [],
        culturalNotes: insertArticle.culturalNotes || {},
      })
      .returning();
    return article;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values({
        ...insertProgress,
        wordsLearned: insertProgress.wordsLearned || [],
        comprehensionScore: insertProgress.comprehensionScore || null,
      })
      .returning();
    return progress;
  }

  async getUserVocabulary(userId: string): Promise<Vocabulary[]> {
    return await db.select().from(vocabulary).where(eq(vocabulary.userId, userId));
  }

  async createVocabulary(insertVocabulary: InsertVocabulary): Promise<Vocabulary> {
    const [vocab] = await db
      .insert(vocabulary)
      .values({
        ...insertVocabulary,
        culturalContext: insertVocabulary.culturalContext || null,
        nativeTranslation: insertVocabulary.nativeTranslation || null,
        exampleSentence: insertVocabulary.exampleSentence || null,
      })
      .returning();
    return vocab;
  }

  async updateVocabulary(id: string, updates: Partial<Vocabulary>): Promise<Vocabulary | undefined> {
    const [vocab] = await db
      .update(vocabulary)
      .set(updates)
      .where(eq(vocabulary.id, id))
      .returning();
    return vocab || undefined;
  }
}

export const storage = new DatabaseStorage();
