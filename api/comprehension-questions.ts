import 'dotenv/config';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateComprehensionQuestions } from '../server/services/openai';
import { LevelEnum } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const schema = z.object({
      articleContent: z.string().min(1),
      difficultyLevel: LevelEnum,
    });

    const { articleContent, difficultyLevel } = schema.parse(req.body);
    const questions = await generateComprehensionQuestions(articleContent, difficultyLevel);
    return res.status(200).json({ questions });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to generate questions', 
      error: (error as Error).message 
    });
  }
}