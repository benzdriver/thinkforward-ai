const { i18n } = require('./next-i18next.config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // 不需要指定dir，因为配置文件已经在frontend目录下
  distDir: 'dist',
  i18n,
  publicRuntimeConfig: {
    staticFolder: '/public',  // 使用相对路径
  },
}

module.exports = nextConfig 