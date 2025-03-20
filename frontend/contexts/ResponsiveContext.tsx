import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

// 定义标准断点
export const breakpoints = {
  xs: '(max-width: 639px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

export type Breakpoint = keyof typeof breakpoints;

interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  activeBreakpoint: Breakpoint;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export const ResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isXs = useMediaQuery(breakpoints.xs);
  const isSm = useMediaQuery(breakpoints.sm);
  const isMd = useMediaQuery(breakpoints.md);
  const isLg = useMediaQuery(breakpoints.lg);
  const isXl = useMediaQuery(breakpoints.xl);
  const is2Xl = useMediaQuery(breakpoints['2xl']);
  
  // 确定当前活动的断点
  const getActiveBreakpoint = (): Breakpoint => {
    if (is2Xl) return '2xl';
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
  };
  
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>(getActiveBreakpoint());
  
  useEffect(() => {
    setActiveBreakpoint(getActiveBreakpoint());
  }, [isXs, isSm, isMd, isLg, isXl, is2Xl]);
  
  const value = {
    isMobile: isXs || (isSm && !isMd),
    isTablet: isMd && !isLg,
    isDesktop: isLg && !isXl,
    isLargeDesktop: isXl || is2Xl,
    activeBreakpoint,
  };
  
  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = (): ResponsiveContextType => {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
}; 