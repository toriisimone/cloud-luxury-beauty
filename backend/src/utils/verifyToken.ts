import jwt from 'jsonwebtoken';
import { config } from './../config/env';

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const verifyToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as DecodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const verifyRefreshToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as DecodedToken;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
