import 'dotenv/config';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../server/storage';
import { adaptArticle } from '../server/services/openai';
import { LanguageEnum, LevelEnum } from '../shared/schema';
import { z } from 'zod';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
    
    return res.status(200).json({ 
      ...article, 
      comprehensionQuestions: adaptedArticle.comprehensionQuestions 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to adapt article', 
      error: (error as Error).message 
    });
  }
}