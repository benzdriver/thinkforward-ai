import React from 'react';
import type { AppProps } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';
import { appWithTranslation } from 'next-i18next';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { AuthenticatedApp } from '@/components/auth/AuthenticatedApp';
import { RTLWrapper } from '@/components/layout/RTLWrapper';
import nextI18NextConfig from '../next-i18next.config.js';
import '@/styles/globals.css';

// 确保在客户端初始化 i18next 后端
if (typeof window !== 'undefined') {
  const i18next = require('i18next');
  const Backend = require('i18next-http-backend').default;
  const LanguageDetector = require('i18next-browser-languagedetector').default;
  const { initReactI18next } = require('react-i18next');
  
  if (!i18next.isInitialized) {
    i18next
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next);
  }
}

console.log('_app.tsx is being loaded');

function MyApp({ Component, pageProps }: AppProps) {
  console.log('Rendering MyApp component');
  
  return (
    <ClerkProvider {...pageProps}>
      <ErrorBoundary>
        <RTLWrapper>
          <AuthenticatedApp>
            <Component {...pageProps} />
          </AuthenticatedApp>
        </RTLWrapper>
      </ErrorBoundary>
    </ClerkProvider>
  );
}

console.log('Exporting appWithTranslation');
export default appWithTranslation(MyApp, nextI18NextConfig);