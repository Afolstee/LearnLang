import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  nativeLanguage: text("native_language").notNull(),
  currentLevel: text("current_level").notNull().default("A1"),
  streakDays: integer("streak_days").notNull().default(0),
  totalWordsLearned: integer("total_words_learned").notNull().default(0),
  totalArticlesRead: integer("total_articles_read").notNull().default(0),
  achievements: jsonb("achievements").notNull().default([]),
  createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
});

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  difficultyLevel: text("difficulty_level").notNull(),
  estimatedReadTime: integer("estimated_read_time").notNull(),
  imageUrl: text("image_url"),
  tags: jsonb("tags").notNull().default([]),
  culturalNotes: jsonb("cultural_notes").notNull().default({}),
  createdAt: timestamp("created_at").notNull().default(sql`NOW()`),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  articleId: varchar("article_id").notNull(),
  completedAt: timestamp("completed_at").notNull().default(sql`NOW()`),
  wordsLearned: jsonb("words_learned").notNull().default([]),
  comprehensionScore: integer("comprehension_score"),
});

export const vocabulary = pgTable("vocabulary", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  word: text("word").notNull(),
  definition: text("definition").notNull(),
  culturalContext: text("cultural_context"),
  nativeTranslation: text("native_translation"),
  exampleSentence: text("example_sentence"),
  learnedAt: timestamp("learned_at").notNull().default(sql`NOW()`),
  reviewCount: integer("review_count").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  nativeLanguage: true,
  currentLevel: true,
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  content: true,
  summary: true,
  category: true,
  difficultyLevel: true,
  estimatedReadTime: true,
  imageUrl: true,
  tags: true,
  culturalNotes: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  articleId: true,
  wordsLearned: true,
  comprehensionScore: true,
});

export const insertVocabularySchema = createInsertSchema(vocabulary).pick({
  userId: true,
  word: true,
  definition: true,
  culturalContext: true,
  nativeTranslation: true,
  exampleSentence: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertVocabulary = z.infer<typeof insertVocabularySchema>;
export type Vocabulary = typeof vocabulary.$inferSelect;

export const LanguageEnum = z.enum(["spanish", "french", "mandarin"]);
export const LevelEnum = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);
export const CategoryEnum = z.enum(["business", "technology", "culture", "travel", "science", "general"]);

export type Language = z.infer<typeof LanguageEnum>;
export type Level = z.infer<typeof LevelEnum>;
export type Category = z.infer<typeof CategoryEnum>;
