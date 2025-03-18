import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { db } = await connectToDatabase();
  
  // GET: 获取用户角色
  if (req.method === 'GET') {
    try {
      const user = await db.collection('users').findOne({ clerkId: userId });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json({ 
        role: user.role || 'GUEST',
        userId: user._id 
      });
    } catch (error) {
      console.error('Error fetching user role:', error);
      return res.status(500).json({ error: 'Failed to fetch user role' });
    }
  }
  
  // PUT: 更新用户角色 (仅管理员可用)
  if (req.method === 'PUT') {
    try {
      const { targetUserId, newRole } = req.body;
      
      if (!targetUserId || !newRole) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // 验证当前用户是否为管理员
      const currentUser = await db.collection('users').findOne({ clerkId: userId });
      
      if (!currentUser || currentUser.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Permission denied' });
      }
      
      // 更新目标用户角色
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(targetUserId) },
        { $set: { role: newRole } }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Target user not found' });
      }
      
      return res.status(200).json({ success: true, message: 'User role updated successfully' });
    } catch (error) {
      console.error('Error updating user role:', error);
      return res.status(500).json({ error: 'Failed to update user role' });
    }
  }
  
  // 不支持的HTTP方法
  return res.status(405).json({ error: 'Method not allowed' });
} 