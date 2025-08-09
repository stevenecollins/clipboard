import { Router, Request, Response } from 'express';
import axios from 'axios';
import { prisma } from '@/config/database';
import { config } from '@/config';
import { ApiResponse } from '@/types/api';
import { userValidation } from '@/utils/validation';
import { 
  createFirebaseUser, 
  generatePasswordResetLink,
  generateEmailVerificationLink,
  verifyFirebaseToken 
} from '@/config/firebase';
import { authenticateFirebaseToken, AuthRequest } from '@/middleware/auth';

const router = Router();

// Firebase Web API endpoint
const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts`;

// Register with Firebase
router.post('/firebase/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = userValidation.create.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: { message: error.details[0].message },
      });
      return;
    }

    const { email, password, name } = value;

    // Check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        error: { message: 'User with this email already exists' },
      });
      return;
    }

    // Create Firebase user
    const firebaseUser = await createFirebaseUser(email, password, name);

    // Create user in our database
    const user = await prisma.user.create({
      data: {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        authProvider: 'firebase',
        emailVerified: firebaseUser.emailVerified,
      },
      select: {
        id: true,
        email: true,
        name: true,
        firebaseUid: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generate email verification link if not verified
    let verificationLink = null;
    if (!firebaseUser.emailVerified) {
      try {
        verificationLink = await generateEmailVerificationLink(email);
      } catch (error) {
        console.warn('Failed to generate email verification link:', error);
      }
    }

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        firebaseUid: firebaseUser.uid,
        emailVerificationRequired: !firebaseUser.emailVerified,
        ...(verificationLink && { verificationLink }),
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Firebase signup error:', error);
    
    // Handle Firebase-specific errors
    if (error.code === 'auth/email-already-exists') {
      res.status(409).json({
        success: false,
        error: { message: 'Email already registered with Firebase' },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: { message: 'Registration failed' },
    });
  }
});

// Sign in with Firebase (verify token and sync user)
router.post('/firebase/signin', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({
        success: false,
        error: { message: 'Firebase ID token required' },
      });
      return;
    }

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(idToken);

    // Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      // Try to find by email and link Firebase UID
      user = await prisma.user.findUnique({
        where: { email: decodedToken.email! },
      });

      if (user) {
        // Link existing user to Firebase
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            firebaseUid: decodedToken.uid,
            emailVerified: decodedToken.email_verified || false,
            lastSignIn: new Date(),
          },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            firebaseUid: decodedToken.uid,
            email: decodedToken.email!,
            name: decodedToken.name || decodedToken.email!.split('@')[0],
            authProvider: 'firebase',
            emailVerified: decodedToken.email_verified || false,
            avatarUrl: decodedToken.picture,
            lastSignIn: new Date(),
          },
        });
      }
    } else {
      // Update last sign in
      await prisma.user.update({
        where: { id: user.id },
        data: { lastSignIn: new Date() },
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          emailVerified: user.emailVerified,
        },
        firebaseUid: user.firebaseUid,
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Firebase signin error:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Invalid Firebase token' },
    });
  }
});

// Request password reset
router.post('/firebase/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: { message: 'Email address required' },
      });
      return;
    }

    // Check if user exists in our database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal whether email exists for security
      res.status(200).json({
        success: true,
        data: { message: 'If the email exists, a reset link has been sent' },
      });
      return;
    }

    // Generate password reset link
    const resetLink = await generatePasswordResetLink(email);

    // In production, you would send this via email service
    // For development, we'll return it in the response
    const response: ApiResponse = {
      success: true,
      data: {
        message: 'Password reset link sent',
        ...(config.nodeEnv === 'development' && { resetLink }),
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send password reset email' },
    });
  }
});

// Resend email verification
router.post('/firebase/resend-verification', authenticateFirebaseToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;

    if (user.firebaseUid && user.email) {
      const verificationLink = await generateEmailVerificationLink(user.email);

      const response: ApiResponse = {
        success: true,
        data: {
          message: 'Verification email sent',
          ...(config.nodeEnv === 'development' && { verificationLink }),
        },
      };

      res.status(200).json(response);
    } else {
      res.status(400).json({
        success: false,
        error: { message: 'User not associated with Firebase' },
      });
    }
  } catch (error: any) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to send verification email' },
    });
  }
});

// Refresh Firebase token (proxy to Firebase)
router.post('/firebase/refresh-token', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: { message: 'Refresh token required' },
      });
      return;
    }

    const response = await axios.post(`${FIREBASE_AUTH_URL}:secureToken?key=${config.firebase.webApiKey}`, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    res.status(200).json({
      success: true,
      data: {
        idToken: response.data.id_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      },
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Invalid refresh token' },
    });
  }
});

// Delete Firebase user and local user
router.delete('/firebase/delete-account', authenticateFirebaseToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;

    if (user.firebaseUid) {
      // Delete from Firebase (this will also revoke all tokens)
      try {
        const { deleteFirebaseUser } = await import('@/config/firebase');
        await deleteFirebaseUser(user.firebaseUid);
      } catch (error) {
        console.error('Failed to delete Firebase user:', error);
      }
    }

    // Delete from our database (cascade will handle related data)
    await prisma.user.delete({
      where: { id: user.id },
    });

    const response: ApiResponse = {
      success: true,
      data: { message: 'Account deleted successfully' },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete account' },
    });
  }
});

export { router as firebaseAuthRouter };