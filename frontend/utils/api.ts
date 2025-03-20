import { function as API_CONFIG } from '../config/api';

// API 请求工具函数
export async function fetchApi(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  try {
    // 获取 Clerk token
    const token = localStorage.getItem('clerk-token');
    
    // 合并选项并添加认证头
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    };
    
    // 发送请求
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, fetchOptions);
    
    // 如果响应不成功，抛出错误
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || '请求失败');
    }
    
    // 返回解析后的JSON数据
    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// API 端点函数，匹配后端的现有路由
export const api = {
  auth: {
    // 获取认证状态
    getStatus: () => fetchApi('/api/auth/status'),
    
    // 验证令牌
    verifyToken: (token: string) => fetchApi('/api/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
    
    // 注销
    logout: () => fetchApi('/api/auth/logout', { method: 'POST' }),
  },
  
  user: {
    // 获取当前用户信息
    getCurrentUser: () => fetchApi('/api/users/me'),
    
    // 获取用户角色
    getCurrentRole: () => fetchApi('/api/users/role'),
    
    // 获取用户权限
    getPermissions: () => fetchApi('/api/users/permissions'),
    
    // 更新用户个人资料
    updateProfile: (data: any) => fetchApi('/api/users/profile', {
      method: 'POST',  // 注意这里是 POST，根据现有路由
      body: JSON.stringify(data),
    }),
  },
  
  // 顾问相关
  consultant: {
    // 获取所有顾问
    getAll: () => fetchApi('/api/users/consultants'),
    
    // 分配顾问给客户
    assignToClient: (data: { consultantId: string, clientId: string }) => 
      fetchApi('/api/users/assign-consultant', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  
  // 客户管理
  client: {
    // 获取所有客户
    getAll: () => fetchApi('/api/users/clients'),
  },
  
  // 评估相关
  assessment: {
    // 创建评估
    create: (data: any) => fetchApi('/api/assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    // 获取评估列表
    getAll: () => fetchApi('/api/assessments'),
    
    // 获取单个评估
    getById: (id: string) => fetchApi(`/api/assessments/${id}`),
    
    // 更新评估
    update: (id: string, data: any) => fetchApi(`/api/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    // 删除评估
    delete: (id: string) => fetchApi(`/api/assessments/${id}`, {
      method: 'DELETE',
    }),
    
    // 生成PDF
    generatePDF: (id: string) => fetchApi(`/api/assessments/${id}/pdf`),
    
    // 重新生成评估
    regenerate: (id: string) => fetchApi(`/api/assessments/${id}/regenerate`, {
      method: 'POST',
    }),
  },
  
  // 健康检查 (如果存在)
  health: () => fetchApi('/api/health'),
}; 