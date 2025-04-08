const DocumentSubmission = require('../../models/canada/DocumentSubmission');

/**
 * Get document checklist based on program type and profile
 * @param {String} program - Program type
 * @param {Object} profile - User profile
 * @returns {Array} - Document checklist
 */
exports.getDocumentChecklist = (program, profile) => {
  return getDocumentChecklistForProgram(program, profile);
};

/**
 * Upload document
 * @param {Object} documentData - Document data
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - Uploaded document
 */
exports.uploadDocument = async (documentData, userId) => {
  try {
    const document = new DocumentSubmission({
      ...documentData,
      userId,
      uploadDate: new Date(),
      status: 'Pending'
    });
    
    await document.save();
    
    return document;
  } catch (error) {
    throw error;
  }
};

/**
 * Get document by ID
 * @param {String} documentId - Document ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - Retrieved document
 */
exports.getDocument = async (documentId, userId) => {
  try {
    const document = await DocumentSubmission.findById(documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    if (document.userId.toString() !== userId) {
      throw new Error('Unauthorized to access this document');
    }
    
    return document;
  } catch (error) {
    throw error;
  }
};

/**
 * Get document checklist based on program type
 * @param {String} program - Program type
 * @param {Object} profile - User profile
 * @returns {Array} - Document checklist
 */
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
