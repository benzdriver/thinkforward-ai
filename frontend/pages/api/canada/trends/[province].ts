import { NextApiRequest, NextApiResponse } from 'next';

// 定义本地接口，不从types/canada导入以避免错误
interface RegionalTrendData {
  province: string;
  period: string;
  invitations: number;
  minimumScore?: number;
  topOccupations: {
    noc: string;
    title: string;
    count: number;
  }[];
  growthRate: number;
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
    // 1. Fetch historical trend data for the province from a database
    // 2. Process and format the data for the client
    // 3. Return the trend data

    // For demo purposes, we'll return mock data
    const mockTrends: RegionalTrendData[] = [
      {
        province: province,
        period: 'Q1 2023',
        invitations: 950,
        minimumScore: 485,
        topOccupations: [
          { noc: '21234', title: 'Software Engineers', count: 120 },
          { noc: '31303', title: 'Registered Nurses', count: 95 },
          { noc: '40030', title: 'Secondary School Teachers', count: 75 }
        ],
        growthRate: 0.05
      },
      {
        province: province,
        period: 'Q2 2023',
        invitations: 1050,
        minimumScore: 480,
        topOccupations: [
          { noc: '21234', title: 'Software Engineers', count: 135 },
          { noc: '31303', title: 'Registered Nurses', count: 105 },
          { noc: '40030', title: 'Secondary School Teachers', count: 80 }
        ],
        growthRate: 0.11
      },
      {
        province: province,
        period: 'Q3 2023',
        invitations: 1100,
        minimumScore: 478,
        topOccupations: [
          { noc: '21234', title: 'Software Engineers', count: 145 },
          { noc: '31303', title: 'Registered Nurses', count: 110 },
          { noc: '72400', title: 'Electricians', count: 85 }
        ],
        growthRate: 0.05
      },
      {
        province: province,
        period: 'Q4 2023',
        invitations: 1150,
        minimumScore: 475,
        topOccupations: [
          { noc: '21234', title: 'Software Engineers', count: 155 },
          { noc: '31303', title: 'Registered Nurses', count: 120 },
          { noc: '72400', title: 'Electricians', count: 90 }
        ],
        growthRate: 0.04
      },
      {
        province: province,
        period: 'Q1 2024',
        invitations: 1200,
        minimumScore: 472,
        topOccupations: [
          { noc: '21234', title: 'Software Engineers', count: 160 },
          { noc: '31303', title: 'Registered Nurses', count: 125 },
          { noc: '72400', title: 'Electricians', count: 95 }
        ],
        growthRate: 0.04
      }
    ];

    // Return the trends
    return res.status(200).json({ trends: mockTrends });
  } catch (error) {
    console.error('Error fetching regional trends:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 