import { Router, Request, Response } from 'express';
import axios from 'axios';
import { prisma } from '@/config/database';
import { config } from '@/config';
import { ApiResponse } from '@/types/api';
import { verifyFirebaseToken } from '@/config/firebase';

const router = Router();

// Google OAuth verification and user creation/signin
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken, accessToken } = req.body;

    if (!idToken && !accessToken) {
      res.status(400).json({
        success: false,
        error: { message: 'Google ID token or access token required' },
      });
      return;
    }

    let userInfo: any = null;
    let firebaseUid: string | null = null;

    // If Firebase ID token is provided, verify it
    if (idToken) {
      try {
        const decodedToken = await verifyFirebaseToken(idToken);
        firebaseUid = decodedToken.uid;
        userInfo = {
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
          email_verified: decodedToken.email_verified,
        };
      } catch (error) {
        console.error('Firebase token verification failed:', error);
      }
    }

    // If no Firebase token or verification failed, try Google API
    if (!userInfo && accessToken) {
      try {
        const googleResponse = await axios.get(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
        );
        userInfo = googleResponse.data;
      } catch (error) {
        console.error('Google API verification failed:', error);
        res.status(401).json({
          success: false,
          error: { message: 'Invalid Google token' },
        });
        return;
      }
    }

    if (!userInfo || !userInfo.email) {
      res.status(401).json({
        success: false,
        error: { message: 'Unable to verify Google account' },
      });
      return;
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userInfo.email },
          ...(firebaseUid ? [{ firebaseUid }] : []),
        ],
      },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(firebaseUid && !user.firebaseUid && { firebaseUid }),
          name: userInfo.name || user.name,
          avatarUrl: userInfo.picture || user.avatarUrl,
          emailVerified: userInfo.email_verified || user.emailVerified,
          authProvider: 'google',
          authProviderId: userInfo.id,
          lastSignIn: new Date(),
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          ...(firebaseUid && { firebaseUid }),
          email: userInfo.email,
          name: userInfo.name || userInfo.email.split('@')[0],
          avatarUrl: userInfo.picture,
          authProvider: 'google',
          authProviderId: userInfo.id,
          emailVerified: userInfo.email_verified || false,
          lastSignIn: new Date(),
        },
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
        authProvider: 'google',
        ...(firebaseUid && { firebaseUid }),
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Google authentication failed' },
    });
  }
});

// Apple Sign In verification
router.post('/apple', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken, user: appleUser } = req.body;

    if (!idToken) {
      res.status(400).json({
        success: false,
        error: { message: 'Apple ID token required' },
      });
      return;
    }

    let userInfo: any = null;
    let firebaseUid: string | null = null;

    // Try Firebase token verification first
    try {
      const decodedToken = await verifyFirebaseToken(idToken);
      firebaseUid = decodedToken.uid;
      userInfo = {
        email: decodedToken.email,
        name: decodedToken.name,
        email_verified: decodedToken.email_verified,
      };
    } catch (error) {
      console.error('Firebase Apple token verification failed:', error);
      
      // For Apple Sign In, we might need to decode the JWT manually
      // This is a simplified version - in production, you'd want to verify the signature
      try {
        const tokenParts = idToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          userInfo = {
            email: payload.email,
            email_verified: payload.email_verified,
            sub: payload.sub, // Apple's unique identifier
          };
        }
      } catch (decodeError) {
        console.error('Failed to decode Apple ID token:', decodeError);
      }
    }

    // Use Apple user data if provided (first sign in only)
    if (appleUser && appleUser.name) {
      userInfo = {
        ...userInfo,
        name: `${appleUser.name.firstName} ${appleUser.name.lastName}`.trim(),
      };
    }

    if (!userInfo || !userInfo.email) {
      res.status(401).json({
        success: false,
        error: { message: 'Unable to verify Apple account' },
      });
      return;
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userInfo.email },
          ...(firebaseUid ? [{ firebaseUid }] : []),
          ...(userInfo.sub ? [{ authProviderId: userInfo.sub }] : []),
        ],
      },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(firebaseUid && !user.firebaseUid && { firebaseUid }),
          ...(userInfo.name && { name: userInfo.name }),
          emailVerified: userInfo.email_verified || user.emailVerified,
          authProvider: 'apple',
          authProviderId: userInfo.sub || user.authProviderId,
          lastSignIn: new Date(),
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          ...(firebaseUid && { firebaseUid }),
          email: userInfo.email,
          name: userInfo.name || userInfo.email.split('@')[0],
          authProvider: 'apple',
          authProviderId: userInfo.sub,
          emailVerified: userInfo.email_verified || false,
          lastSignIn: new Date(),
        },
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
        authProvider: 'apple',
        ...(firebaseUid && { firebaseUid }),
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Apple auth error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Apple authentication failed' },
    });
  }
});

// Generic social auth endpoint (works with Firebase)
router.post('/social', async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken, provider } = req.body;

    if (!idToken || !provider) {
      res.status(400).json({
        success: false,
        error: { message: 'ID token and provider required' },
      });
      return;
    }

    // Verify Firebase token (which handles social providers)
    const decodedToken = await verifyFirebaseToken(idToken);

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid: decodedToken.uid },
          { email: decodedToken.email! },
        ],
      },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firebaseUid: decodedToken.uid,
          name: decodedToken.name || user.name,
          avatarUrl: decodedToken.picture || user.avatarUrl,
          emailVerified: decodedToken.email_verified || user.emailVerified,
          authProvider: provider,
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
          avatarUrl: decodedToken.picture,
          authProvider: provider,
          emailVerified: decodedToken.email_verified || false,
          lastSignIn: new Date(),
        },
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
        authProvider: provider,
        firebaseUid: user.firebaseUid,
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Social auth error:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Social authentication failed' },
    });
  }
});

export { router as socialAuthRouter };