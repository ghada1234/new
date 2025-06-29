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
} from 'firebase/auth';
import { auth as firebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { RegisterData } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (data: RegisterData) => Promise<User | null>;
  login: (email: string, pass: string) => Promise<User | null>;
  logout: () => Promise<void>;
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

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
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
