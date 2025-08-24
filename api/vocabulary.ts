import 'dotenv/config';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../server/storage';
import { insertVocabularySchema } from '../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        const vocabularyData = insertVocabularySchema.parse(req.body);
        const vocabulary = await storage.createVocabulary(vocabularyData);
        return res.status(200).json(vocabulary);

      case 'GET':
        const { userId } = req.query;
        if (userId) {
          const userVocabulary = await storage.getUserVocabulary(userId as string);
          return res.status(200).json(userVocabulary);
        }
        return res.status(400).json({ message: "User ID required" });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: (error as Error).message 
    });
  }
}