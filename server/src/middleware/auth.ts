import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import logger from '../library/Logger.js';
import { config } from '../config/config.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      return res.status(403).send('Access Denied');
    }

    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
      logger.log(`jwt token: ${token}`);
    }

    const verified = jwt.verify(token, config.jwt.secret as string);
    req.user = verified;
    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
