import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import { UserRole } from '../../types/user';
import Link from 'next/link';

interface DocumentsPageProps {
  userRole: UserRole;
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  submittedAt: string;
  updatedAt: string;
  comments?: string;
}

export function DocumentsPage({ userRole }: DocumentsPageProps) {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/client/documents');
        
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        
        const data = await response.json();
        setDocuments(data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isLoaded && userId) {
      fetchDocuments();
    }
  }, [isLoaded, userId]);
  
  // 如果不是客户角色，重定向到控制台
  useEffect(() => {
    if (isLoaded && userRole !== UserRole.CLIENT && userRole !== UserRole.ADMIN) {
      router.push('/dashboard');
    }
  }, [isLoaded, userRole, router]);
  
  // 根据筛选条件过滤文档
  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.status === filter;
  });
  
  const handleViewDocument = (documentId: string) => {
    router.push(`/client/document/${documentId}`);
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已拒绝';
      case 'pending':
        return '审核中';
      case 'draft':
        return '草稿';
      default:
        return status;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            我的文档
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            查看您提交的所有表格和文档
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link href="/client/forms">
            <span className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              填写新表格
            </span>
          </Link>
        </div>
      </div>
      
      {/* 筛选器 */}
      <div className="mb-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="mt-4 sm:mt-0">
              <div className="flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    filter === 'all' ? 'bg-blue-50 text-blue-600 z-10' : 'bg-white text-gray-700'
                  }`}
                >
                  全部
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('approved')}
                  className={`relative inline-flex items-center px-4 py-2 border-t border-b border-r border-gray-300 text-sm font-medium ${
                    filter === 'approved' ? 'bg-green-50 text-green-600 z-10' : 'bg-white text-gray-700'
                  }`}
                >
                  已通过
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('pending')}
                  className={`relative inline-flex items-center px-4 py-2 border-t border-b border-r border-gray-300 text-sm font-medium ${
                    filter === 'pending' ? 'bg-yellow-50 text-yellow-600 z-10' : 'bg-white text-gray-700'
                  }`}
                >
                  审核中
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('rejected')}
                  className={`relative inline-flex items-center px-4 py-2 border-t border-b border-r border-gray-300 text-sm font-medium ${
                    filter === 'rejected' ? 'bg-red-50 text-red-600 z-10' : 'bg-white text-gray-700'
                  }`}
                >
                  已拒绝
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('draft')}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-md border-t border-b border-r border-gray-300 text-sm font-medium ${
                    filter === 'draft' ? 'bg-gray-50 text-gray-600 z-10' : 'bg-white text-gray-700'
                  }`}
                >
                  草稿
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 文档列表 */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有文档</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' ? '您还没有提交任何文档。' : `您没有${getStatusText(filter)}的文档。`}
          </p>
          <div className="mt-6">
            <Link href="/client/forms">
              <span className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                填写新表格
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredDocuments.map((document) => (
              <li key={document.id}>
                <div 
                  className="block hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewDocument(document.id)}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{document.name}</p>
                          <p className="text-sm text-gray-500">{document.type}</p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(document.status)}`}>
                          {getStatusText(document.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          提交于 {document.submittedAt}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>
                          更新于 {document.updatedAt}
                        </p>
                      </div>
                    </div>
                    {document.comments && document.status === 'rejected' && (
                      <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                        <p><strong>拒绝原因：</strong> {document.comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
