FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# 创建上传目录
RUN mkdir -p uploads

COPY . .

ENV NODE_ENV=production

# 健康检查 - 帮助Railway监控应用状态
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/api/health || exit 1

EXPOSE 3001

CMD ["node", "server.js"] 