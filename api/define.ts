import { VercelRequest, VercelResponse } from '@vercel/node';
import { defineWord } from '../server/services/openai';
import { LanguageEnum } from '../shared/schema';
import { z } from 'zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const schema = z.object({
      word: z.string().min(1),
      nativeLanguage: LanguageEnum,
      context: z.string().optional(),
    });

    const { word, nativeLanguage, context } = schema.parse(req.body);
    const definition = await defineWord(word, nativeLanguage, context);
    return res.status(200).json(definition);
  } catch (error) {
    return res.status(500).json({ 
      message: 'Failed to define word', 
      error: (error as Error).message 
    });
  }
}