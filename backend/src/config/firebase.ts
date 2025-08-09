import admin from 'firebase-admin';
import { config } from './index';

interface FirebaseConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = (): admin.app.App => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    const firebaseConfig: FirebaseConfig = {
      projectId: config.firebase.projectId,
      privateKey: config.firebase.privateKey.replace(/\\n/g, '\n'),
      clientEmail: config.firebase.clientEmail,
    };

    // Validate required Firebase configuration
    if (!firebaseConfig.projectId || !firebaseConfig.privateKey || !firebaseConfig.clientEmail) {
      console.warn('⚠️  Firebase configuration incomplete. Running without Firebase Auth.');
      return null as any;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      projectId: firebaseConfig.projectId,
    });

    console.log('🔥 Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    throw new Error('Firebase initialization failed');
  }
};

export const getFirebaseApp = (): admin.app.App | null => {
  return firebaseApp;
};

export const verifyFirebaseToken = async (token: string): Promise<admin.auth.DecodedIdToken> => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }
  
  return admin.auth().verifyIdToken(token);
};

export const createFirebaseUser = async (email: string, password: string, displayName?: string): Promise<admin.auth.UserRecord> => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }

  return admin.auth().createUser({
    email,
    password,
    displayName,
    emailVerified: false,
  });
};

export const updateFirebaseUser = async (uid: string, properties: admin.auth.UpdateRequest): Promise<admin.auth.UserRecord> => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }

  return admin.auth().updateUser(uid, properties);
};

export const deleteFirebaseUser = async (uid: string): Promise<void> => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }

  return admin.auth().deleteUser(uid);
};

export const generatePasswordResetLink = async (email: string): Promise<string> => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }

  return admin.auth().generatePasswordResetLink(email, {
    url: `${config.frontend.webUrl}/auth/reset-complete`,
  });
};

export const generateEmailVerificationLink = async (email: string): Promise<string> => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }

  return admin.auth().generateEmailVerificationLink(email, {
    url: `${config.frontend.webUrl}/auth/verify-complete`,
  });
};

// Initialize Firebase on module load
if (process.env.NODE_ENV !== 'test') {
  try {
    initializeFirebase();
  } catch (error) {
    console.error('Failed to initialize Firebase on startup:', error);
  }
}

export default admin;