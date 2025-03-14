const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  version: 'v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

export default API_CONFIG; 