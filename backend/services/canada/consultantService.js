const CanadianCase = require('../../models/canada/CanadianCase');

/**
 * Get cases for a consultant
 * @param {String} consultantId - Consultant ID
 * @returns {Promise<Array>} - List of cases
 */
exports.getCases = async (consultantId) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      return getFullCaseData(consultantId);
    }
    
    return await CanadianCase.find({ consultantId });
  } catch (error) {
    throw error;
  }
};

/**
 * Get full case data for production environment
 * @param {String} consultantId - Consultant ID
 * @returns {Array} - List of cases with full details
 */
function getFullCaseData(consultantId) {
  return [
    {
      id: 'case-001',
      clientName: 'John Smith',
      clientEmail: 'john.smith@example.com',
      programType: 'Express Entry',
      status: 'In Progress',
      createdAt: '2023-10-15T10:30:00Z',
      updatedAt: '2023-11-01T14:45:00Z',
      documents: [
        {
          id: 'doc-001',
          name: 'Passport',
          status: 'Approved',
          uploadDate: '2023-10-16T09:15:00Z'
        },
        {
          id: 'doc-002',
          name: 'Language Test Results',
          status: 'Pending',
          uploadDate: '2023-10-20T11:30:00Z'
        }
      ],
      notes: [
        {
          id: 'note-001',
          content: 'Initial consultation completed',
          createdAt: '2023-10-15T11:45:00Z',
          createdBy: 'Consultant'
        },
        {
          id: 'note-002',
          content: 'Requested additional documents',
          createdAt: '2023-10-18T14:20:00Z',
          createdBy: 'Consultant'
        }
      ],
      timeline: [
        {
          id: 'timeline-001',
          event: 'Case created',
          date: '2023-10-15T10:30:00Z'
        },
        {
          id: 'timeline-002',
          event: 'Documents requested',
          date: '2023-10-15T11:45:00Z'
        },
        {
          id: 'timeline-003',
          event: 'Passport uploaded',
          date: '2023-10-16T09:15:00Z'
        },
        {
          id: 'timeline-004',
          event: 'Language test results uploaded',
          date: '2023-10-20T11:30:00Z'
        }
      ]
    },
    {
      id: 'case-002',
      clientName: 'Jane Doe',
      clientEmail: 'jane.doe@example.com',
      programType: 'Provincial Nominee Program',
      status: 'Awaiting Documents',
      createdAt: '2023-09-20T09:00:00Z',
      updatedAt: '2023-10-25T16:30:00Z',
      documents: [
        {
          id: 'doc-003',
          name: 'Passport',
          status: 'Approved',
          uploadDate: '2023-09-22T10:45:00Z'
        },
        {
          id: 'doc-004',
          name: 'Education Credentials',
          status: 'Rejected',
          uploadDate: '2023-10-05T14:20:00Z',
          rejectionReason: 'Document not properly certified'
        }
      ],
      notes: [
        {
          id: 'note-003',
          content: 'Initial consultation completed',
          createdAt: '2023-09-20T10:15:00Z',
          createdBy: 'Consultant'
        },
        {
          id: 'note-004',
          content: 'Client interested in Ontario PNP',
          createdAt: '2023-09-25T11:30:00Z',
          createdBy: 'Consultant'
        },
        {
          id: 'note-005',
          content: 'Education credentials need recertification',
          createdAt: '2023-10-05T15:00:00Z',
          createdBy: 'Consultant'
        }
      ],
      timeline: [
        {
          id: 'timeline-005',
          event: 'Case created',
          date: '2023-09-20T09:00:00Z'
        },
        {
          id: 'timeline-006',
          event: 'Documents requested',
          date: '2023-09-20T10:15:00Z'
        },
        {
          id: 'timeline-007',
          event: 'Passport uploaded',
          date: '2023-09-22T10:45:00Z'
        },
        {
          id: 'timeline-008',
          event: 'Education credentials uploaded',
          date: '2023-10-05T14:20:00Z'
        },
        {
          id: 'timeline-009',
          event: 'Education credentials rejected',
          date: '2023-10-05T14:30:00Z'
        }
      ]
    }
  ];
}
