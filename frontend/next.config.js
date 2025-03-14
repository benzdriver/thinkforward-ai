const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // 不需要指定dir，因为配置文件已经在frontend目录下
  distDir: 'dist',
  // 恢复i18n配置
  i18n,
  publicRuntimeConfig: {
    staticFolder: '/public',  // 使用相对路径
  },
  
  // 修复rewrites规则，确保不会引发basePath错误
  async rewrites() {
    return [
      // 根路径重定向到landing页面
      {
        source: '/',
        destination: '/landing',
      },
    ];
  },

  webpack: (config, { dev, isServer }) => {
    // 如果是生产环境并且是客户端代码，移除所有console调用
    if (!dev && !isServer) {
      // 确保存在minimizer数组
      if (!config.optimization) {
        config.optimization = {};
      }
      if (!config.optimization.minimizer) {
        config.optimization.minimizer = [];
      }
      
      // 添加TerserPlugin配置
      const TerserPlugin = require('terser-webpack-plugin');
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // 移除所有console.*调用
            },
          },
        }),
      );
    }
    
    // 如果您有其他webpack配置，在这里保留
    
    return config;
  },
}

module.exports = nextConfig 