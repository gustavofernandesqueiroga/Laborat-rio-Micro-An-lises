
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export type UserRole = 'VISITOR' | 'CLIENT' | 'GUEPARDO' | 'EAL' | 'PARTNER' | 'CLT' | 'ADMIN';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unit?: string;
  photoURL?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  logout: () => Promise<void>;
  signup: (email: string, pass: string, name: string, role?: UserRole, extraData?: any) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: (role?: UserRole) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureUserProfile = async (fUser: FirebaseUser, defaultRole: UserRole = 'CLIENT', name?: string) => {
    const { doc, getDoc, setDoc } = await import('firebase/firestore');
    const userDocRef = doc(db, 'users', fUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    let userData: any;
    if (!userDoc.exists()) {
      userData = {
        uid: fUser.uid,
        name: name || fUser.displayName || 'Usuário',
        email: fUser.email || '',
        role: defaultRole,
        status: defaultRole === 'CLIENT' ? 'approved' : 'pending',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, userData);
    } else {
      userData = userDoc.data();
    }

    // If user is a Guepardo, ensure they have a profile
    if (userData.role === 'GUEPARDO' || userData.role === 'guepardo') {
      const profileDocRef = doc(db, 'guepardo_profiles', fUser.uid);
      const profileDoc = await getDoc(profileDocRef);
      if (!profileDoc.exists()) {
        await setDoc(profileDocRef, {
          uid: fUser.uid,
          dailyGoal: 10,
          collectionsToday: 0,
          totalEarnings: 0,
          hearts: 5.0,
          badges: ['Pioneiro'],
          createdAt: new Date().toISOString()
        });
      }
    }
    return userData;
  };

  useEffect(() => {
    const savedMockUser = localStorage.getItem('coletaja_mock_user');
    if (savedMockUser) {
      try {
        const parsed = JSON.parse(savedMockUser);
        setUser(parsed);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('coletaja_mock_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        try {
          const userData = await ensureUserProfile(fUser);
          setUser({
            id: fUser.uid,
            name: userData.name || fUser.displayName || 'Usuário',
            email: fUser.email || '',
            role: userData.role || 'CLIENT',
            unit: userData.unit,
            photoURL: userData.photoUrl || fUser.photoURL || undefined,
            status: userData.status
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser({
            id: fUser.uid,
            name: fUser.displayName || 'Usuário',
            email: fUser.email || '',
            role: 'CLIENT',
            photoURL: fUser.photoURL || undefined
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, pass: string, name: string, role: UserRole = 'CLIENT', extraData: any = {}) => {
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const { setDoc, doc } = await import('firebase/firestore');
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const fUser = userCredential.user;
      
      await updateProfile(fUser, { displayName: name });
      
      const userData: any = {
        uid: fUser.uid,
        name,
        email,
        role,
        status: role === 'CLIENT' ? 'approved' : 'pending',
        createdAt: new Date().toISOString(),
        ...extraData
      };

      await setDoc(doc(db, 'users', fUser.uid), userData);

      if (role === 'GUEPARDO') {
        await setDoc(doc(db, 'guepardo_profiles', fUser.uid), {
          uid: fUser.uid,
          totalEarnings: 0,
          collectionsToday: 0,
          dailyGoal: 10,
          badges: ['Pioneiro'],
          hearts: 5,
          rating: 5,
          ...extraData.profile
        });
      }
      const loggedUser = {
        id: fUser.uid,
        name,
        email,
        role,
        status: userData.status
      };
      setUser(loggedUser);
      localStorage.setItem('coletaja_mock_user', JSON.stringify(loggedUser));
    } catch (e: any) {
      if (e.code === 'auth/operation-not-allowed') {
        const simulatedUser: User = {
          id: 'simulated-' + Date.now(),
          name,
          email,
          role,
          status: role === 'CLIENT' ? 'approved' : 'pending'
        };
        setUser(simulatedUser);
        localStorage.setItem('coletaja_mock_user', JSON.stringify(simulatedUser));
        return;
      }
      throw e;
    }
  };

  const login = async (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check for pre-registered credentials requested by user
    if (trimmedEmail === 'admin@micro.com' && pass === 'Zary10') {
      const mockAdmin: User = {
        id: 'admin-micro-id',
        name: 'Holding Queiroga Admin',
        email: 'admin@micro.com',
        role: 'ADMIN',
        status: 'approved'
      };
      setUser(mockAdmin);
      localStorage.setItem('coletaja_mock_user', JSON.stringify(mockAdmin));
      return;
    }

    if (trimmedEmail === 'logistica@micro.com' && pass === 'Micro123') {
      const mockEal: User = {
        id: 'eal-micro-id',
        name: 'Equipe Logística (EAL)',
        email: 'logistica@micro.com',
        role: 'EAL',
        status: 'approved'
      };
      setUser(mockEal);
      localStorage.setItem('coletaja_mock_user', JSON.stringify(mockEal));
      return;
    }

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      const fUser = credential.user;
      const userData = await ensureUserProfile(fUser);
      const loggedUser = {
        id: fUser.uid,
        name: userData.name || fUser.displayName || 'Usuário',
        email: fUser.email || '',
        role: userData.role || 'CLIENT',
        unit: userData.unit,
        photoURL: userData.photoUrl || fUser.photoURL || undefined,
        status: userData.status
      };
      setUser(loggedUser);
      localStorage.setItem('coletaja_mock_user', JSON.stringify(loggedUser));
    } catch (e: any) {
      if (e.code === 'auth/operation-not-allowed' || e.code === 'auth/user-not-found') {
        const simulatedName = email.split('@')[0];
        const simulatedUser: User = {
          id: 'simulated-' + Date.now(),
          name: simulatedName.charAt(0).toUpperCase() + simulatedName.slice(1),
          email,
          role: 'CLIENT',
          status: 'approved'
        };
        setUser(simulatedUser);
        localStorage.setItem('coletaja_mock_user', JSON.stringify(simulatedUser));
        return;
      }
      throw e;
    }
  };

  const signInWithGoogle = async (role: UserRole = 'CLIENT') => {
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userData = await ensureUserProfile(result.user, role);
    const loggedUser = {
      id: result.user.uid,
      name: userData.name || result.user.displayName || 'Usuário',
      email: result.user.email || '',
      role: userData.role || 'CLIENT',
      unit: userData.unit,
      photoURL: userData.photoUrl || result.user.photoURL || undefined,
      status: userData.status
    };
    setUser(loggedUser);
    localStorage.setItem('coletaja_mock_user', JSON.stringify(loggedUser));
  };

  const logout = async () => {
    localStorage.removeItem('coletaja_mock_user');
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    window.location.href = '#/login';
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, logout, signup, login, signInWithGoogle, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
