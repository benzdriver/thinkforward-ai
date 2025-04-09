const DocumentSubmission = require('../../models/canada/DocumentSubmission');

exports.getDocumentChecklist = async (req, res) => {
  try {
    const { program } = req.query;
    const profile = req.body;
    
    const documents = getDocumentChecklistForProgram(program, profile);
    
    return res.status(200).json({
      success: true,
      documents
    });
  } catch (error) {
    console.error('Error getting document checklist:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get document checklist',
      error: error.message
    });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const documentData = req.body;
    
    const document = new DocumentSubmission({
      ...documentData,
      userId: req.user._id, // Assuming authentication middleware sets req.user
      uploadDate: new Date(),
      status: 'Pending'
    });
    
    await document.save();
    
    return res.status(201).json({
      success: true,
      document
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    
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
    
    return res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch document',
      error: error.message
    });
  }
};

function getDocumentChecklistForProgram(program, profile) {
  const commonDocuments = [
    'Valid passport',
    'Birth certificate',
    'Marriage certificate (if applicable)',
    'Language test results',
    'Educational credential assessment (ECA)',
    'Resume/CV'
  ];
  
  const programSpecificDocuments = {
    'express-entry': [
      'Express Entry profile number',
      'Provincial nomination certificate (if applicable)',
      'Proof of funds',
      'Police certificates',
      'Medical examination results'
    ],
    'pnp': [
      'Provincial nomination application',
      'Job offer letter (if applicable)',
      'Proof of connection to province',
      'Settlement funds proof',
      'Business plan (for entrepreneur streams)'
    ],
    'family-sponsorship': [
      'Relationship proof',
      'Sponsor\'s notice of assessment',
      'Sponsor\'s employment letter',
      'Statutory declaration of relationship',
      'Photos and communication history'
    ],
    'study-permit': [
      'Acceptance letter from Canadian institution',
      'Proof of financial support',
      'Study plan',
      'Transcripts from previous education',
      'Letter of explanation'
    ],
    'work-permit': [
      'Job offer letter',
      'Labor Market Impact Assessment (LMIA)',
      'Employment contract',
      'Proof of qualifications',
      'Work experience letters'
    ]
  };
  
  const additionalDocuments = [];
  
  if (profile.maritalStatus === 'married' || profile.maritalStatus === 'commonLaw') {
    additionalDocuments.push(
      'Spouse\'s passport',
      'Spouse\'s language test results',
      'Spouse\'s educational documents',
      'Marriage certificate or proof of common-law relationship'
    );
  }
  
  if (profile.hasChildren) {
    additionalDocuments.push(
      'Children\'s birth certificates',
      'Children\'s passports',
      'Custody documents (if applicable)',
      'Adoption papers (if applicable)'
    );
  }
  
  if (profile.canadianWorkExperience > 0) {
    additionalDocuments.push(
      'Canadian work permits',
      'Canadian employment letters',
      'Canadian tax returns (T4 slips)',
      'Canadian reference letters'
    );
  }
  
  if (profile.hasCanadianEducation) {
    additionalDocuments.push(
      'Canadian educational transcripts',
      'Canadian diplomas/degrees',
      'Canadian study permits'
    );
  }
  
  return [
    ...commonDocuments,
    ...(programSpecificDocuments[program] || []),
    ...additionalDocuments
  ];
}
