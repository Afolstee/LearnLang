import 'dotenv/config';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { DatabaseStorage } from '../server/storage';
import { insertUserSchema } from '../shared/schema';

const storage = new DatabaseStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        const userData = insertUserSchema.parse(req.body);
        const user = await storage.createUser(userData);
        return res.status(200).json(user);

      case 'GET':
        const { id } = req.query;
        if (id) {
          const user = await storage.getUser(id as string);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          return res.status(200).json(user);
        }
        return res.status(400).json({ message: "User ID required" });

      case 'PATCH':
        const { id: userId } = req.query;
        const updates = req.body;
        const updatedUser = await storage.updateUser(userId as string, updates);
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(updatedUser);

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