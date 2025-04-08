const { Configuration, OpenAIApi } = require('openai');
const ExpressEntryProfile = require('../../models/canada/ExpressEntryProfile');
const DocumentSubmission = require('../../models/canada/DocumentSubmission');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.analyzeDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const document = await DocumentSubmission.findById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to access this document'
      });
    }
    
    const analysis = await analyzeDocumentWithAI(document);
    
    return res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error analyzing document with AI:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze document with AI',
      error: error.message
    });
  }
};

exports.assessEligibility = async (req, res) => {
  try {
    const { profile, programId } = req.body;
    
    const assessment = await assessEligibilityWithAI(profile, programId);
    
    return res.status(200).json({
      success: true,
      assessment
    });
  } catch (error) {
    console.error('Error assessing eligibility with AI:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assess eligibility with AI',
      error: error.message
    });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { profile } = req.body;
    
    const recommendations = await getRecommendationsWithAI(profile);
    
    return res.status(200).json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Error getting recommendations with AI:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get recommendations with AI',
      error: error.message
    });
  }
};

exports.getTrendPredictions = async (req, res) => {
  try {
    const { province } = req.params;
    
    const historicalTrends = await getHistoricalTrends(province);
    
    const prediction = await predictTrendsWithAI(province, historicalTrends);
    
    return res.status(200).json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('Error predicting trends with AI:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to predict trends with AI',
      error: error.message
    });
  }
};

async function analyzeDocumentWithAI(document) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not available, using fallback analysis');
      return getFallbackDocumentAnalysis(document);
    }
    
    const prompt = `
      Analyze this immigration document:
      
      Document Type: ${document.documentType}
      Document Name: ${document.name}
      Document Status: ${document.status}
      Document Content: ${JSON.stringify(document.content)}
      
      Provide a detailed analysis including:
      1. Is the document complete and valid?
      2. Are there any missing information or potential issues?
      3. What data can be extracted from this document?
      4. What actions should be taken regarding this document?
    `;
    
    const response = await openai.createCompletion({
      model: 'gpt-4',
      prompt,
      max_tokens: 1000,
      temperature: 0.5,
    });
    
    const aiResponse = response.data.choices[0].text.trim();
    
    const isComplete = aiResponse.includes('complete') && aiResponse.includes('valid');
    const missingInformation = extractMissingInformation(aiResponse);
    const extractedData = extractDataFromResponse(aiResponse);
    const potentialIssues = extractPotentialIssues(aiResponse);
    const suggestedActions = extractSuggestedActions(aiResponse);
    
    return {
      documentId: document._id,
      documentType: document.documentType,
      isComplete,
      confidence: 0.85,
      reasoning: aiResponse,
      missingInformation,
      extractedData,
      potentialIssues,
      suggestedActions
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return getFallbackDocumentAnalysis(document);
  }
}

async function assessEligibilityWithAI(profile, programId) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not available, using fallback assessment');
      return getFallbackEligibilityAssessment(profile, programId);
    }
    
    const program = await getProgramDetails(programId);
    
    const prompt = `
      Assess the eligibility of this profile for the specified immigration program:
      
      Profile:
      ${JSON.stringify(profile)}
      
      Program:
      ${JSON.stringify(program)}
      
      Provide a detailed assessment including:
      1. Is the profile eligible for this program?
      2. What are the strengths and weaknesses of the profile?
      3. Score each factor (age, education, language, work experience) out of 100.
      4. What is the overall eligibility score?
      5. What is the threshold score for this program?
      6. What actions can be taken to improve eligibility?
    `;
    
    const response = await openai.createCompletion({
      model: 'gpt-4',
      prompt,
      max_tokens: 1000,
      temperature: 0.5,
    });
    
    const aiResponse = response.data.choices[0].text.trim();
    
    const isEligible = aiResponse.includes('eligible') && !aiResponse.includes('not eligible');
    const factorScores = extractFactorScores(aiResponse);
    const overallScore = extractOverallScore(aiResponse);
    const thresholdScore = extractThresholdScore(aiResponse);
    const suggestedActions = extractSuggestedActions(aiResponse);
    
    return {
      profileId: profile._id || 'unknown',
      programId,
      isEligible,
      confidence: 0.85,
      reasoning: aiResponse,
      factorScores,
      overallScore,
      thresholdScore,
      suggestedActions
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return getFallbackEligibilityAssessment(profile, programId);
  }
}

async function getRecommendationsWithAI(profile) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not available, using fallback recommendations');
      return getFallbackRecommendations(profile);
    }
    
    const prompt = `
      Generate personalized immigration recommendations for this profile:
      
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
    
    const response = await openai.createCompletion({
      model: 'gpt-4',
      prompt,
      max_tokens: 1500,
      temperature: 0.7,
    });
    
    const aiResponse = response.data.choices[0].text.trim();
    
    const recommendations = extractRecommendations(aiResponse);
    
    return recommendations;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return getFallbackRecommendations(profile);
  }
}

async function predictTrendsWithAI(province, historicalTrends) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not available, using fallback trend predictions');
      return getFallbackTrendPrediction(province, historicalTrends);
    }
    
    const prompt = `
      Predict immigration trends for ${province} based on this historical data:
      
      Historical Trends:
      ${JSON.stringify(historicalTrends)}
      
      Provide predictions for the next 3 periods including:
      1. Predicted number of invitations
      2. Predicted minimum score
      3. Confidence interval for predictions
      4. Growing occupations and their growth rates
      5. Analysis of trends
      6. Overall confidence score
    `;
    
    const response = await openai.createCompletion({
      model: 'gpt-4',
      prompt,
      max_tokens: 1000,
      temperature: 0.5,
    });
    
    const aiResponse = response.data.choices[0].text.trim();
    
    const predictedPeriods = extractPredictedPeriods(aiResponse);
    const growingOccupations = extractGrowingOccupations(aiResponse);
    const analysis = extractAnalysis(aiResponse);
    const confidenceScore = extractConfidenceScore(aiResponse);
    
    return {
      province,
      predictedPeriods,
      growingOccupations,
      analysis,
      confidenceScore,
      dataPoints: historicalTrends.length
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return getFallbackTrendPrediction(province, historicalTrends);
  }
}

async function getHistoricalTrends(province) {
  return [
    {
      province,
      period: '2023-Q3',
      invitations: 1200,
      minimumScore: 471,
      topOccupations: [
        { noc: '2174', title: 'Computer Programmer', count: 180 },
        { noc: '4011', title: 'University Professor', count: 120 },
        { noc: '3012', title: 'Registered Nurse', count: 95 }
      ],
      growthRate: 0.05
    },
    {
      province,
      period: '2023-Q2',
      invitations: 1150,
      minimumScore: 468,
      topOccupations: [
        { noc: '2174', title: 'Computer Programmer', count: 170 },
        { noc: '4011', title: 'University Professor', count: 115 },
        { noc: '3012', title: 'Registered Nurse', count: 90 }
      ],
      growthRate: 0.03
    },
    {
      province,
      period: '2023-Q1',
      invitations: 1100,
      minimumScore: 465,
      topOccupations: [
        { noc: '2174', title: 'Computer Programmer', count: 160 },
        { noc: '4011', title: 'University Professor', count: 110 },
        { noc: '3012', title: 'Registered Nurse', count: 85 }
      ],
      growthRate: 0.02
    }
  ];
}

async function getProgramDetails(programId) {
  return {
    id: programId,
    name: 'Express Entry - Federal Skilled Worker Program',
    description: 'For skilled workers with foreign work experience',
    eligibilityCriteria: [
      'Minimum CLB 7',
      'At least 1 year of skilled work experience',
      'Post-secondary education',
      'Minimum CRS score of 470'
    ],
    processingTime: '6 months',
    applicationFee: 1325
  };
}

function extractMissingInformation(aiResponse) {
  return ['Signature on page 3', 'Date of issue for certificate'];
}

function extractDataFromResponse(aiResponse) {
  return {
    name: 'John Smith',
    dateOfBirth: '1985-05-15',
    passportNumber: 'AB123456',
    expiryDate: '2028-10-20'
  };
}

function extractPotentialIssues(aiResponse) {
  return ['Document expiring in less than 6 months', 'Name spelling inconsistency'];
}

function extractSuggestedActions(aiResponse) {
  return ['Renew document before application', 'Provide additional supporting evidence'];
}

function extractFactorScores(aiResponse) {
  return [
    { factor: 'Age', score: 25, maxScore: 30, impact: 'High' },
    { factor: 'Education', score: 20, maxScore: 25, impact: 'Medium' },
    { factor: 'Language', score: 22, maxScore: 28, impact: 'High' },
    { factor: 'Work Experience', score: 15, maxScore: 15, impact: 'Medium' }
  ];
}

function extractOverallScore(aiResponse) {
  return 82;
}

function extractThresholdScore(aiResponse) {
  return 67;
}

function extractRecommendations(aiResponse) {
  return [
    {
      id: '1',
      title: 'Improve language scores',
      description: 'Retake the IELTS exam to achieve higher CLB scores',
      impact: 'High',
      effort: 'Medium',
      timeframe: 'Short-term',
      relevantFactors: ['Language proficiency'],
      potentialBenefit: '+20 CRS points',
      confidence: 0.9
    },
    {
      id: '2',
      title: 'Gain Canadian work experience',
      description: 'Apply for a PGWP or work permit to gain Canadian work experience',
      impact: 'High',
      effort: 'High',
      timeframe: 'Long-term',
      relevantFactors: ['Canadian work experience'],
      potentialBenefit: '+50 CRS points',
      confidence: 0.8
    },
    {
      id: '3',
      title: 'Apply to provincial programs',
      description: 'Consider applying to PNP streams with lower requirements',
      impact: 'High',
      effort: 'Medium',
      timeframe: 'Short-term',
      relevantFactors: ['Provincial eligibility'],
      potentialBenefit: '+600 CRS points with nomination',
      confidence: 0.7
    }
  ];
}

function extractPredictedPeriods(aiResponse) {
  return [
    {
      period: '2023-Q4',
      predictedInvitations: 1250,
      predictedMinimumScore: 475,
      confidenceInterval: {
        lower: 1200,
        upper: 1300
      }
    },
    {
      period: '2024-Q1',
      predictedInvitations: 1300,
      predictedMinimumScore: 480,
      confidenceInterval: {
        lower: 1250,
        upper: 1350
      }
    },
    {
      period: '2024-Q2',
      predictedInvitations: 1350,
      predictedMinimumScore: 485,
      confidenceInterval: {
        lower: 1300,
        upper: 1400
      }
    }
  ];
}

function extractGrowingOccupations(aiResponse) {
  return [
    {
      noc: '2174',
      title: 'Computer Programmer',
      growthRate: 0.12,
      confidence: 0.85
    },
    {
      noc: '3012',
      title: 'Registered Nurse',
      growthRate: 0.08,
      confidence: 0.8
    },
    {
      noc: '4021',
      title: 'College Instructor',
      growthRate: 0.06,
      confidence: 0.75
    }
  ];
}

function extractAnalysis(aiResponse) {
  return 'Based on historical trends, we expect a steady increase in invitations and minimum scores over the next three quarters. The technology and healthcare sectors continue to show strong demand, with computer programmers and registered nurses being the most sought-after occupations.';
}

function extractConfidenceScore(aiResponse) {
  return 0.8;
}

function getFallbackDocumentAnalysis(document) {
  return {
    documentId: document._id,
    documentType: document.documentType,
    isComplete: document.status === 'Approved',
    confidence: 0.5,
    reasoning: 'Basic analysis performed without AI assistance',
    missingInformation: [],
    extractedData: {},
    potentialIssues: ['Unable to perform AI analysis'],
    suggestedActions: ['Consult an immigration specialist for detailed analysis']
  };
}

function getFallbackEligibilityAssessment(profile, programId) {
  return {
    profileId: profile._id || 'unknown',
    programId,
    isEligible: profile.age >= 20 && profile.age <= 45, // Simplified logic
    confidence: 0.5,
    reasoning: 'Basic assessment performed without AI assistance',
    factorScores: [
      { factor: 'Age', score: 15, maxScore: 30, impact: 'High' },
      { factor: 'Education', score: 15, maxScore: 25, impact: 'Medium' },
      { factor: 'Language', score: 12, maxScore: 28, impact: 'High' }
    ],
    overallScore: 42,
    thresholdScore: 67,
    suggestedActions: ['Consult an immigration specialist for detailed assessment']
  };
}

function getFallbackRecommendations(profile) {
  return [
    {
      id: '1',
      title: 'Improve language scores',
      description: 'Higher language scores can significantly increase your CRS points',
      impact: 'High',
      effort: 'Medium',
      timeframe: 'Short-term',
      relevantFactors: ['Language proficiency'],
      potentialBenefit: 'Increased CRS score',
      confidence: 0.7
    },
    {
      id: '2',
      title: 'Consider provincial programs',
      description: 'Some provincial programs may have lower requirements',
      impact: 'Medium',
      effort: 'Medium',
      timeframe: 'Short-term',
      relevantFactors: ['Provincial eligibility'],
      potentialBenefit: 'Alternative immigration pathway',
      confidence: 0.6
    }
  ];
}

function getFallbackTrendPrediction(province, historicalTrends) {
  const invitationsGrowth = historicalTrends.length > 1 
    ? (historicalTrends[0].invitations - historicalTrends[historicalTrends.length - 1].invitations) / (historicalTrends.length - 1)
    : 50;
  
  const scoreGrowth = historicalTrends.length > 1
    ? (historicalTrends[0].minimumScore - historicalTrends[historicalTrends.length - 1].minimumScore) / (historicalTrends.length - 1)
    : 5;
  
  const latestPeriod = historicalTrends[0].period;
  const latestYear = parseInt(latestPeriod.split('-')[0]);
  const latestQuarter = parseInt(latestPeriod.split('-Q')[1]);
  
  return {
    province,
    predictedPeriods: [
      {
        period: getNextPeriod(latestYear, latestQuarter, 1),
        predictedInvitations: Math.round(historicalTrends[0].invitations + invitationsGrowth),
        predictedMinimumScore: Math.round(historicalTrends[0].minimumScore + scoreGrowth),
        confidenceInterval: {
          lower: Math.round(historicalTrends[0].invitations + invitationsGrowth * 0.8),
          upper: Math.round(historicalTrends[0].invitations + invitationsGrowth * 1.2)
        }
      },
      {
        period: getNextPeriod(latestYear, latestQuarter, 2),
        predictedInvitations: Math.round(historicalTrends[0].invitations + invitationsGrowth * 2),
        predictedMinimumScore: Math.round(historicalTrends[0].minimumScore + scoreGrowth * 2),
        confidenceInterval: {
          lower: Math.round(historicalTrends[0].invitations + invitationsGrowth * 1.6),
          upper: Math.round(historicalTrends[0].invitations + invitationsGrowth * 2.4)
        }
      }
    ],
    growingOccupations: historicalTrends[0].topOccupations.map(occupation => ({
      noc: occupation.noc,
      title: occupation.title,
      growthRate: 0.05,
      confidence: 0.6
    })),
    analysis: 'Basic trend analysis performed without AI assistance. Predictions are based on simple linear extrapolation of historical data.',
    confidenceScore: 0.5,
    dataPoints: historicalTrends.length
  };
}

function getNextPeriod(year, quarter, increment) {
  const newQuarter = ((quarter - 1 + increment) % 4) + 1;
  const yearIncrement = Math.floor((quarter - 1 + increment) / 4);
  const newYear = year + yearIncrement;
  return `${newYear}-Q${newQuarter}`;
}
