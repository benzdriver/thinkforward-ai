import { logger as hybridLogger } from '../utils/hybridLogger';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useClerk, useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { UserRole } from '../types/user';
import { api } from '../utils/api';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: any | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  userData: any | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
  refreshUserData: async () => {},
  userData: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clerk = useClerk();
  const { isLoaded: clerkLoaded, session, signOut: clerkSignOut } = clerk;
  const { isLoaded: authLoaded, userId } = useClerkAuth();
  const { user } = useUser();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 合并加载状态
  const isLoaded = clerkLoaded && authLoaded;
  
  // 完善 signOut 方法
  const signOut = async () => {
    try {
      localStorage.removeItem('clerk-token');
      await clerkSignOut();
      router.push('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  // 获取 token 的可靠方法
  const getToken = async () => {
    return session?.getToken() || '';
  };

  // 刷新用户角色
  const refreshUserRole = async () => {
    try {
      if (userId) {
        const response = await api.user.getCurrentRole();
        if (response.success) {
          setUserRole(response.role as UserRole);
        } else {
          setUserRole(UserRole.GUEST);
        }
      } else {
        setUserRole(UserRole.GUEST);
      }
    } catch (error) {
      hybridLogger.error('获取用户角色失败:', error);
      setUserRole(UserRole.GUEST);
    }
  };

  // 刷新用户数据
  const refreshUserData = async () => {
    try {
      if (userId) {
        const response = await api.user.getCurrentUser();
        if (response.success) {
          setUserData(response.user);
        }
      } else {
        setUserData(null);
      }
    } catch (error) {
      hybridLogger.error('获取用户数据失败:', error);
      setUserData(null);
    }
  };

  // 存储 Clerk 令牌到 localStorage
  const storeClerkToken = async () => {
    try {
      if (userId && isLoaded) {
        const token = await getToken();
        if (token) {
          localStorage.setItem('clerk-token', token);
          return true;
        }
      }
      return false;
    } catch (error) {
      hybridLogger.error('存储 Clerk token 失败:', error);
      return false;
    }
  };

  // 初始化用户状态
  useEffect(() => {
    const initUserState = async () => {
      if (isLoaded) {
        if (userId) {
          const tokenStored = await storeClerkToken();
          if (tokenStored) {
            try {
              // 验证令牌
              await api.auth.verifyToken(localStorage.getItem('clerk-token') || '');
              
              // 获取用户角色和数据
              await refreshUserRole();
              await refreshUserData();
            } catch (error) {
              hybridLogger.error('初始化用户状态失败:', error);
              setUserRole(UserRole.GUEST);
              setUserData(null);
            }
          }
        } else {
          setUserRole(UserRole.GUEST);
          setUserData(null);
          localStorage.removeItem('clerk-token');
        }
        setIsLoading(false);
      }
    };

    initUserState();
  }, [isLoaded, userId, user]);

  const refreshUser = async () => {
    await Promise.all([refreshUserRole(), refreshUserData()]);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      isLoading, 
      isAuthenticated: !!user,
      signOut,
      signIn: async (email: string, password: string) => {
        try {
          const signInAttempt = await clerk.client.signIn.create({
            identifier: email,
            password
          });
          
          if (signInAttempt.status === 'needs_first_factor') {
            router.push(`/auth/verify?email=${email}`);
          } else {
            await refreshUser();
          }
        } catch (error) {
          hybridLogger.error('登录失败:', error);
          throw error;
        }
      },
      refreshUser,
      refreshUserData,
      userData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 