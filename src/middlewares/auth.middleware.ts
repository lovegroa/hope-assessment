import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {envValues, serverError} from '../utils/general.utils';

const {JWT_SECRET} = envValues;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.header('Authorization');

  if (!bearerToken) {
    return res.status(401).json({message: 'No token provided'});
  }

  const token = bearerToken.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({message: 'Invalid token'});
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string') return serverError(res);
    if (!('userId' in decoded)) return serverError(res);
    Object.assign(req, {userId: decoded.userId});
    return next();
  } catch (error) {
    return res.status(401).json({message: 'Invalid token'});
  }
};
