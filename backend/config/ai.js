module.exports = {
  // OpenAI配置
  openai: {
    models: {
      chat: process.env.OPENAI_CHAT_MODEL || 'gpt-4-turbo',
      embedding: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large'
    },
    maxTokens: {
      assessment: 4000,
      formHelp: 1000,
      chat: 2000,
      documentReview: 3000
    },
    temperature: {
      assessment: 0.3,
      formHelp: 0.4,
      chat: 0.7,
      documentReview: 0.2
    }
  },
  
  // 向量存储配置
  vectorStore: {
    provider: process.env.VECTOR_STORE_PROVIDER || 'pinecone',
    dimensions: 1536, // For OpenAI embeddings
    collections: {
      immigrationLaws: 'immigration-laws',
      formGuidance: 'form-guidance',
      countryInfo: 'country-info'
    }
  },
  
  // AI聊天默认设置
  chat: {
    historyLimit: 20,
    systemPromptMaxLength: 1000,
    defaultLanguage: 'en'
  },
  
  // 评估配置
  assessment: {
    defaultScoreThresholds: {
      high: 75,
      medium: 50,
      low: 25
    }
  }
}; 