import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const { id, limit, offset, category, level } = req.query;
        
        if (id) {
          const article = await storage.getArticle(id as string);
          if (!article) {
            return res.status(404).json({ message: "Article not found" });
          }
          return res.status(200).json(article);
        }

        const limitNum = limit ? parseInt(limit as string) : 10;
        const offsetNum = offset ? parseInt(offset as string) : 0;
        const articles = await storage.getArticles(
          limitNum, 
          offsetNum, 
          category as string, 
          level as string
        );
        return res.status(200).json(articles);

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