import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import { UserRole } from '../../types/user';

interface ChatPageProps {
  userRole: UserRole;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Consultant {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  status: 'online' | 'offline' | 'busy';
  lastActive: string;
}

export function ChatPage({ userRole }: ChatPageProps) {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 如果不是客户角色，重定向到控制台
  useEffect(() => {
    if (isLoaded && userRole !== UserRole.CLIENT && userRole !== UserRole.ADMIN) {
      router.push('/dashboard');
    }
  }, [isLoaded, userRole, router]);
  
  useEffect(() => {
    async function fetchConsultantAndMessages() {
      try {
        // 获取分配给客户的顾问
        const consultantResponse = await fetch('/api/client/consultant');
        const consultantData = await consultantResponse.json();
        
        if (consultantResponse.ok && consultantData.consultant) {
          setConsultant(consultantData.consultant);
          
          // 获取与该顾问的聊天记录
          const messagesResponse = await fetch(`/api/chat/messages?consultantId=${consultantData.consultant.id}`);
          const messagesData = await messagesResponse.json();
          
          if (messagesResponse.ok) {
            setMessages(messagesData.messages);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : '操作失败');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isLoaded && userId) {
      fetchConsultantAndMessages();
    }
  }, [isLoaded, userId]);
  
  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() || !consultant) return;
    
    setIsSending(true);
    
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: input,
          receiverId: consultant.id,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // 添加新消息到列表
        setMessages(prev => [...prev, data.message]);
        setInput('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : '操作失败');
      alert('发送消息失败，请稍后重试');
    } finally {
      setIsSending(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!consultant) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">没有分配顾问</h2>
          <p className="mt-1 text-sm text-gray-500">
            您目前没有分配的移民顾问。请完善个人资料或联系管理员获取支持。
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col bg-white shadow-sm rounded-lg overflow-hidden h-[calc(100vh-200px)]">
        {/* 顾问信息 */}
        <div className="px-4 py-3 bg-gray-50 border-b flex items-center">
          <div className="relative">
            <img 
              src={consultant.avatarUrl || 'https://via.placeholder.com/40'} 
              alt={consultant.name} 
              className="h-10 w-10 rounded-full"
            />
            <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
              consultant.status === 'online' ? 'bg-green-400' :
              consultant.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
            }`}></span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{consultant.name}</p>
            <p className="text-xs text-gray-500">
              {consultant.status === 'online' ? '在线' :
               consultant.status === 'busy' ? '忙碌中' : `上次在线: ${consultant.lastActive}`}
            </p>
          </div>
        </div>
        
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>开始和您的移民顾问聊天吧！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderRole === UserRole.CLIENT ? 'justify-end' : ''}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
                      message.senderRole === UserRole.CLIENT
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-right mt-1 text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* 消息输入框 */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage}>
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入您的消息..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isSending ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : '发送'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 