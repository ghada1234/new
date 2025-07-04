'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  signInWithPopup,
} from 'firebase/auth';
import { auth as firebaseAuth, isFirebaseConfigured, googleProvider, facebookProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { RegisterData } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (data: RegisterData) => Promise<User | null>;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<User | null>;
  loginWithFacebook: () => Promise<User | null>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  uid: 'mock-user-id',
  email: 'dev@nutrisnap.app',
  displayName: 'Dev User',
  photoURL: `https://placehold.co/100x100.png`,
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  providerId: 'password',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    token: 'mock-token',
    expirationTime: '',
    authTime: '',
    issuedAtTime: '',
    signInProvider: null,
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setUser(mockUser);
      setLoading(false);
      return;
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (!isFirebaseConfigured()) {
      setUser(mockUser);
      return mockUser;
    }
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      pass
    );
    return userCredential.user;
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
        setUser(mockUser);
        return mockUser;
    }
    const userCredential = await signInWithPopup(firebaseAuth, googleProvider);
    return userCredential.user;
  }
  
  const loginWithFacebook = async () => {
    if (!isFirebaseConfigured()) {
        setUser(mockUser);
        return mockUser;
    }
    const userCredential = await signInWithPopup(firebaseAuth, facebookProvider);
    return userCredential.user;
  }

  const register = async (data: RegisterData) => {
    if (!isFirebaseConfigured()) {
      setUser(mockUser);
      return mockUser;
    }
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      data.email,
      data.password
    );
    await updateProfile(userCredential.user, {
      displayName: data.name,
    });
    return userCredential.user;
  };

  const logout = async () => {
    if (!isFirebaseConfigured()) {
      setUser(null);
      router.push('/login');
      return;
    }
    await signOut(firebaseAuth);
    router.push('/login');
  };

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!isFirebaseConfigured()) {
      if (user) {
        // For the mock user, just update the state object
        const updatedMockUser = { ...user, ...data };
        // We have to cast here because the mock user doesn't have the full User methods
        setUser(updatedMockUser as User); 
      }
      return;
    }
    const currentUser = firebaseAuth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, data);
      // The currentUser object from auth is updated in-place.
      // We create a new object to trigger React's state update.
      // This is safe for this app as we only access data properties from the user object.
      setUser({ ...currentUser });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, loginWithGoogle, loginWithFacebook, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
