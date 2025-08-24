import 'dotenv/config';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../server/storage';
import { insertUserProgressSchema } from '../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
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
        
        return res.status(200).json(progress);

      case 'GET':
        const { userId } = req.query;
        if (userId) {
          const userProgress = await storage.getUserProgress(userId as string);
          return res.status(200).json(userProgress);
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