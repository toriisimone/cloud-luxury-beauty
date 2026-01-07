import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};
