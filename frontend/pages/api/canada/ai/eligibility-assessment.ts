import { NextApiRequest, NextApiResponse } from 'next';

// 定义本地接口，不从types/canada导入以避免错误
interface AIEligibilityResult {
  profileId: string;
  programId: string;
  isEligible: boolean;
  confidence: number;
  reasoning: string;
  factorScores: {
    factor: string;
    score: number;
    maxScore: number;
    impact: 'High' | 'Medium' | 'Low';
  }[];
  overallScore: number;
  thresholdScore: number;
  suggestedActions?: string[];
  riskFactors?: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get the profile and programId from the request body
    const { profile, programId } = req.body;

    if (!profile || !programId) {
      return res.status(400).json({ message: 'Profile and program ID are required' });
    }

    // In a real application, we would:
    // 1. Validate the profile data
    // 2. Fetch the program details from a database
    // 3. Use AI to assess eligibility
    // 4. Store the assessment results
    // 5. Return the AI assessment

    // For demo purposes, we'll return mock data
    const mockAssessment: AIEligibilityResult = {
      profileId: profile.id || 'mock-profile-id',
      programId,
      isEligible: true,
      confidence: 0.87,
      reasoning: "Based on the profile information, this candidate meets all core requirements for Express Entry. Age (30), education (Master's degree), and language proficiency (CLB 9) are all strong factors. Canadian work experience adds significant points. The candidate easily exceeds the CRS cutoff threshold based on recent draws.",
      factorScores: [
        { factor: 'Age', score: 25, maxScore: 30, impact: 'High' },
        { factor: 'Education', score: 23, maxScore: 25, impact: 'High' },
        { factor: 'Language Proficiency', score: 24, maxScore: 28, impact: 'High' },
        { factor: 'Work Experience', score: 15, maxScore: 15, impact: 'Medium' },
        { factor: 'Adaptability', score: 8, maxScore: 10, impact: 'Low' }
      ],
      overallScore: 95,
      thresholdScore: 67,
      suggestedActions: [
        "Consider obtaining a provincial nomination for additional points",
        "Ensure education credentials assessment is up to date"
      ],
      riskFactors: [
        "Language test results will expire in 6 months - consider retaking test"
      ]
    };

    // Return the assessment
    return res.status(200).json({ assessment: mockAssessment });
  } catch (error) {
    console.error('Error assessing eligibility:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 