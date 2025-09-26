import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
