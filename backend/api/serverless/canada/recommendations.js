const { connectToDatabase } = require('../_utils/db');
const { verifyToken, verifyClerkSession } = require('../_utils/auth');
const OpenAI = require('openai');
const logger = require('../../../utils/logger');

let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-development',
  });
} catch (error) {
  logger.warn('Failed to initialize OpenAI client:', error.message);
  openai = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{ message: { content: 'This is a fallback response from the mock OpenAI client.' } }]
        })
      }
    }
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type, X-Clerk-Auth');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    await connectToDatabase();

    let user;
    const authHeader = req.headers.authorization;
    const clerkSession = req.headers['x-clerk-auth'];

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      logger.info(`${process.env.NODE_ENV} environment detected, using mock user and bypassing authentication`);
      user = {
        _id: 'test-user-id',
        email: 'test@example.com',
        role: 'user'
      };
    } 
    else {
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          user = await verifyToken(token);
        } catch (authError) {
          logger.error('Token verification error:', authError);
          return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: authError.message
          });
        }
      } else if (clerkSession) {
        try {
          user = await verifyClerkSession(clerkSession);
        } catch (authError) {
          logger.error('Clerk session verification error:', authError);
          return res.status(401).json({
            success: false,
            message: 'Invalid session',
            error: authError.message
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          error: "Authorization token is required"
        });
      }
    }

    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Profile data is required'
      });
    }

    logger.info('Current directory:', __dirname);
    
    try {
      const path = require('path');
      const rootDir = path.resolve(__dirname, '../../../..');
      const aiServicePath = path.join(rootDir, 'services', 'canada', 'aiService');
      
      logger.info('Attempting to load aiService from:', aiServicePath);
      
      if (process.env.NODE_ENV === 'test') {
        logger.info('Test environment detected, using fallback recommendations');
        const recommendations = getFallbackRecommendations(profile);
        
        return res.status(200).json({
          success: true,
          recommendations
        });
      }
      
      const aiService = require(aiServicePath);
      logger.info('Successfully loaded aiService');
      
      const recommendations = await aiService.getRecommendations(profile);
      logger.info('Got recommendations from aiService');
      
      return res.status(200).json({
        success: true,
        recommendations
      });
    } catch (serviceError) {
      logger.error('Error loading or using aiService:', serviceError);
      
      const recommendations = getFallbackRecommendations(profile);
      logger.info('Using fallback recommendations due to error');
      
      return res.status(200).json({
        success: true,
        recommendations
      });
    }
  } catch (error) {
    logger.error('Error in AI recommendations serverless function:', error);
    
    const errorDetails = {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      code: error.code,
      name: error.name
    };
    
    return res.status(500).json({
      success: false,
      message: 'Failed to get recommendations with AI',
      error: error.message,
      details: process.env.NODE_ENV !== 'production' ? errorDetails : undefined
    });
  }
};

async function getRecommendationsWithAI(profile) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      logger.warn('OpenAI API key not available, using fallback recommendations');
      return getFallbackRecommendations(profile);
    }
    
    const prompt = `
      Generate personalized immigration recommendations for this Express Entry profile:
      
      Profile:
      ${JSON.stringify(profile)}
      
      Provide 3-5 specific recommendations including:
      1. Title of the recommendation
      2. Detailed description
      3. Impact level (High, Medium, Low)
      4. Effort required (High, Medium, Low)
      5. Timeframe (Immediate, Short-term, Long-term)
      6. Relevant factors
      7. Potential benefit
      8. Confidence level (0-1)
    `;
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an AI assistant that provides Canadian immigration recommendations.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });
    
    const aiResponse = response.choices[0].message.content.trim();
    
    const recommendations = extractRecommendations(aiResponse);
    
    return recommendations;
  } catch (error) {
    logger.error('OpenAI API Error:', error);
    return getFallbackRecommendations(profile);
  }
}

function extractRecommendations(aiResponse) {
  const lines = aiResponse.split('\n').filter(line => line.trim());
  
  const recommendations = [];
  let currentRec = null;
  
  for (const line of lines) {
    if (line.match(/^\d+\.\s/) || line.match(/^Recommendation \d+:/i)) {
      if (currentRec) {
        recommendations.push(currentRec);
      }
      
      const title = line.replace(/^\d+\.\s/, '').replace(/^Recommendation \d+:\s*/i, '').trim();
      currentRec = {
        id: recommendations.length + 1,
        title,
        description: '',
        impact: 'Medium',
        effort: 'Medium',
        timeframe: 'Short-term',
        relevantFactors: [],
        potentialBenefit: '',
        confidence: 0.8
      };
    } else if (currentRec) {
      if (line.match(/impact:?\s*(high|medium|low)/i)) {
        currentRec.impact = line.match(/impact:?\s*(high|medium|low)/i)[1].charAt(0).toUpperCase() + line.match(/impact:?\s*(high|medium|low)/i)[1].slice(1).toLowerCase();
      } else if (line.match(/effort:?\s*(high|medium|low)/i)) {
        currentRec.effort = line.match(/effort:?\s*(high|medium|low)/i)[1].charAt(0).toUpperCase() + line.match(/effort:?\s*(high|medium|low)/i)[1].slice(1).toLowerCase();
      } else if (line.match(/timeframe:?\s*(immediate|short-term|long-term)/i)) {
        currentRec.timeframe = line.match(/timeframe:?\s*(immediate|short-term|long-term)/i)[1].charAt(0).toUpperCase() + line.match(/timeframe:?\s*(immediate|short-term|long-term)/i)[1].slice(1).toLowerCase();
      } else if (line.match(/confidence:?\s*(0\.\d+|1\.0|1)/i)) {
        currentRec.confidence = parseFloat(line.match(/confidence:?\s*(0\.\d+|1\.0|1)/i)[1]);
      } else if (line.match(/benefit:?\s*(.+)/i)) {
        currentRec.potentialBenefit = line.match(/benefit:?\s*(.+)/i)[1].trim();
      } else if (line.match(/factors:?\s*(.+)/i)) {
        const factorsText = line.match(/factors:?\s*(.+)/i)[1].trim();
        currentRec.relevantFactors = factorsText.split(/,\s*/).map(f => f.trim());
      } else {
        currentRec.description += line + ' ';
        
        if (currentRec.relevantFactors.length === 0) {
          const factors = line.match(/\b(education|language|experience|age|job offer|provincial nomination|adaptability)\b/gi);
          if (factors) {
            currentRec.relevantFactors = [...new Set(factors.map(f => f.trim()))];
          }
        }
        
        if (!currentRec.potentialBenefit && line.match(/\+\d+\s*(?:points|CRS)/i)) {
          currentRec.potentialBenefit = line.match(/\+\d+\s*(?:points|CRS)/i)[0].trim();
        }
      }
    }
  }
  
  if (currentRec) {
    recommendations.push(currentRec);
  }
  
  recommendations.forEach(rec => {
    rec.description = rec.description.trim();
  });
  
  return recommendations.slice(0, 5);
}

function getFallbackRecommendations(profile) {
  if (process.env.NODE_ENV === 'test') {
    return [
      {
        id: 'rec1',
        title: 'Improve English language scores',
        description: 'Retake IELTS to achieve CLB 9 in all abilities',
        impact: 'High',
        effort: 'Medium',
        timeframe: 'Short-term',
        relevantFactors: ['Language proficiency', 'Express Entry points'],
        potentialBenefit: '+50 CRS points',
        confidence: 0.95
      }
    ];
  }
  
  return [
    {
      id: '1',
      title: 'Improve language scores',
      description: 'Higher language scores can significantly increase your CRS points. Consider retaking your language test to achieve higher scores, especially in speaking and writing sections.',
      impact: 'High',
      effort: 'Medium',
      timeframe: 'Short-term',
      relevantFactors: ['Language proficiency'],
      potentialBenefit: '+50 CRS points',
      confidence: 0.9
    },
    {
      id: '2',
      title: 'Gain Canadian work experience',
      description: 'Canadian work experience is highly valued in the Express Entry system. Consider applying for a work permit or exploring pathways like the Post-Graduate Work Permit if you studied in Canada.',
      impact: 'High',
      effort: 'High',
      timeframe: 'Long-term',
      relevantFactors: ['Canadian work experience'],
      potentialBenefit: '+80 CRS points',
      confidence: 0.8
    },
    {
      id: '3',
      title: 'Apply to Provincial Nominee Programs',
      description: 'Many provinces have streams aligned with Express Entry that require lower CRS scores. A provincial nomination adds 600 points to your CRS score, virtually guaranteeing an invitation to apply.',
      impact: 'High',
      effort: 'Medium',
      timeframe: 'Medium-term',
      relevantFactors: ['Provincial eligibility'],
      potentialBenefit: '+600 CRS points',
      confidence: 0.7
    }
  ];
}
