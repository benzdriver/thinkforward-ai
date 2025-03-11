FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# 创建上传目录
RUN mkdir -p uploads

COPY . .

# 创建符号链接，将 /app/ai 指向 /app/backend/ai 目录
# 这样系统就能找到 /app/ai/prompts/en/assessment.txt 文件
RUN mkdir -p /app/ai && \
    ln -sf /app/backend/ai/prompts /app/ai/prompts

ENV NODE_ENV=production

# 健康检查 - 帮助Railway监控应用状态
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/api/health || exit 1

EXPOSE 3001

CMD ["node", "server.js"] 