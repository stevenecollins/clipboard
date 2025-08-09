import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config/database';
import { config } from '@/config';
import { verifyFirebaseToken } from '@/config/firebase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    firebaseUid?: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: { message: 'Access token required' },
      });
      return;
    }

    // Try Firebase token first, then fallback to JWT
    let user = null;

    try {
      // Attempt Firebase token verification
      const decodedToken = await verifyFirebaseToken(token);
      
      // Find user by Firebase UID
      user = await prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid },
        select: {
          id: true,
          email: true,
          name: true,
          firebaseUid: true,
          disabled: true,
        },
      });

      // If no user found by Firebase UID, try by email
      if (!user && decodedToken.email) {
        user = await prisma.user.findUnique({
          where: { email: decodedToken.email },
          select: {
            id: true,
            email: true,
            name: true,
            firebaseUid: true,
            disabled: true,
          },
        });

        // Update user with Firebase UID if found
        if (user && !user.firebaseUid) {
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              firebaseUid: decodedToken.uid,
              emailVerified: decodedToken.email_verified || false,
              lastSignIn: new Date(),
            },
          });
          user.firebaseUid = decodedToken.uid;
        }
      }

    } catch (firebaseError) {
      // Fallback to JWT verification
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        
        user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            name: true,
            firebaseUid: true,
            disabled: true,
          },
        });
      } catch (jwtError) {
        console.error('Both Firebase and JWT token verification failed:', { firebaseError, jwtError });
        res.status(403).json({
          success: false,
          error: { message: 'Invalid or expired token' },
        });
        return;
      }
    }

    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: 'User not found' },
      });
      return;
    }

    if (user.disabled) {
      res.status(403).json({
        success: false,
        error: { message: 'Account has been suspended' },
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({
      success: false,
      error: { message: 'Authentication failed' },
    });
  }
};

// Optional middleware for Firebase-only authentication
export const authenticateFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: { message: 'Firebase token required' },
      });
      return;
    }

    const decodedToken = await verifyFirebaseToken(token);
    
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      select: {
        id: true,
        email: true,
        name: true,
        firebaseUid: true,
        disabled: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: 'User not found' },
      });
      return;
    }

    if (user.disabled) {
      res.status(403).json({
        success: false,
        error: { message: 'Account has been suspended' },
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Firebase authentication error:', error);
    res.status(403).json({
      success: false,
      error: { message: 'Invalid Firebase token' },
    });
  }
};