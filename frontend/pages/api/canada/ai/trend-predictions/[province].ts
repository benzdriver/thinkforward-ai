import { NextApiRequest, NextApiResponse } from 'next';

// 定义本地接口，不从types/canada导入以避免错误
interface AITrendPrediction {
  province: string;
  predictedPeriods: {
    period: string;
    predictedInvitations: number;
    predictedMinimumScore?: number;
    confidenceInterval: {
      lower: number;
      upper: number;
    };
  }[];
  growingOccupations: {
    noc: string;
    title: string;
    growthRate: number;
    confidence: number;
  }[];
  analysis: string;
  confidenceScore: number;
  dataPoints: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // Get the province from the request query
    const { province } = req.query;

    if (!province || typeof province !== 'string') {
      return res.status(400).json({ message: 'Province is required' });
    }

    // Validate that the province is valid
    const validProvinces = [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
      'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
      'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec',
      'Saskatchewan', 'Yukon'
    ];
    
    if (!validProvinces.includes(province)) {
      return res.status(400).json({ message: 'Invalid province' });
    }

    // In a real application, we would:
    // 1. Fetch historical trend data for the province
    // 2. Use AI to analyze the data and generate predictions
    // 3. Store the predictions for caching
    // 4. Return the AI predictions

    // For demo purposes, we'll return mock data
    const mockPrediction: AITrendPrediction = {
      province: province,
      predictedPeriods: [
        {
          period: 'Q2 2024',
          predictedInvitations: 1250,
          predictedMinimumScore: 475,
          confidenceInterval: { lower: 1100, upper: 1400 }
        },
        {
          period: 'Q3 2024',
          predictedInvitations: 1350,
          predictedMinimumScore: 472,
          confidenceInterval: { lower: 1200, upper: 1500 }
        },
        {
          period: 'Q4 2024',
          predictedInvitations: 1450,
          predictedMinimumScore: 468,
          confidenceInterval: { lower: 1300, upper: 1600 }
        }
      ],
      growingOccupations: [
        {
          noc: '21234',
          title: 'Software Engineers and Designers',
          growthRate: 0.15,
          confidence: 0.92
        },
        {
          noc: '31303',
          title: 'Registered Nurses',
          growthRate: 0.12,
          confidence: 0.85
        },
        {
          noc: '72400',
          title: 'Electricians',
          growthRate: 0.09,
          confidence: 0.78
        }
      ],
      analysis: `Based on historical data for ${province}, we project a steady increase in the number of invitations issued through Express Entry and Provincial Nominee Programs over the next three quarters. Key factors influencing this trend include labor market needs, government immigration targets, and economic recovery. The provincial government has announced plans to increase nomination allocations, which should result in more invitations. At the same time, we expect the minimum score requirements to gradually decrease as the number of invitations increases. High-demand occupations in technology, healthcare, and skilled trades are expected to continue seeing growth, with software engineering showing the strongest projected increase.`,
      confidenceScore: 0.85,
      dataPoints: 36 // Based on 3 years of monthly data
    };

    // Return the prediction
    return res.status(200).json({ prediction: mockPrediction });
  } catch (error) {
    console.error('Error generating trend predictions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 