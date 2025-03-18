import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { RTLWrapper } from './RTLWrapper';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title 
}) => {
  const { t } = useTranslation(['common', 'layout']);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <RTLWrapper>
      <Head>
        <title>{title || t('dashboard.title') || 'Dashboard'} | ThinkForward AI</title>
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="md:hidden">
          <Header />
        </div>
        
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <div className="flex-1 md:ml-64">
            <div className="hidden md:block">
              <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  <div className="flex-1 flex justify-end">
                    <div className="flex items-center">
                      {/* Notifications */}
                      <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </button>
                      
                      {/* User menu */}
                      <div className="ml-3 relative">
                        <div>
                          <button className="flex items-center max-w-xs bg-white rounded-full focus:outline-none">
                            <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                              <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <main className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page header */}
                {title && (
                  <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                      {title}
                    </h1>
                  </div>
                )}
                
                {/* Page content */}
                <div className="mt-6">
                  {children}
                </div>
              </div>
            </main>
            
            <Footer />
          </div>
        </div>
      </div>
    </RTLWrapper>
  );
}; 