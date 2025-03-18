import hybridLogger from '../utils/hybridLogger';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser, useClerk } from '@clerk/nextjs';
import { UserRole } from '../types/user';
import { api } from '../utils/api';

interface AuthContextType {
  userRole: UserRole;
  isLoading: boolean;
  refreshUserRole: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  userData: any | null;
  user: any | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userRole: UserRole.GUEST,
  isLoading: true,
  refreshUserRole: async () => {},
  refreshUserData: async () => {},
  userData: null,
  user: null,
  signOut: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, userId, getToken } = useClerkAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 登出功能
  const signOut = async () => {
    try {
      localStorage.removeItem('clerk-token');
      await clerk.signOut();
      setUserRole(UserRole.GUEST);
      setUserData(null);
    } catch (error) {
      hybridLogger.error('退出登录失败:', error);
    }
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

  return (
    <AuthContext.Provider value={{ 
      userRole, 
      isLoading, 
      refreshUserRole,
      refreshUserData,
      userData,
      user,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 