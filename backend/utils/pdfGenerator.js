const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { t } = require('./i18nHelper');
const logger = require('./logger');
const config = require('../config');

/**
 * PDF生成器工具类
 * 用于生成各种报告和文档的PDF版本
 */
class PDFGenerator {
  /**
   * 生成评估报告PDF
   * @param {Object} assessment - 评估对象，包含资料和结果
   * @param {String} language - 语言代码
   * @returns {Buffer} - PDF文件的缓冲数据
   */
  static async generateAssessmentPDF(assessment, language = 'en') {
    return new Promise((resolve, reject) => {
      try {
        // 创建PDF文档
        const doc = new PDFDocument({
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
          size: 'A4'
        });
        
        // 收集输出为buffer
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });
        
        // 加载字体以支持多语言
        const fontPath = path.join(__dirname, '../assets/fonts');
        doc.registerFont('NormalFont', path.join(fontPath, 'NotoSans-Regular.ttf'));
        doc.registerFont('BoldFont', path.join(fontPath, 'NotoSans-Bold.ttf'));
        doc.font('NormalFont');
        
        // 添加页眉
        this._addHeader(doc, t('assessment.reportTitle', 'Immigration Assessment Report', {}, language));
        
        // 添加客户信息
        this._addClientInfo(doc, assessment.profile, language);
        
        // 添加评估摘要
        this._addAssessmentSummary(doc, assessment, language);
        
        // 添加详细评估内容
        this._addAssessmentDetails(doc, assessment, language);
        
        // 添加页脚
        this._addFooter(doc, language);
        
        // 完成文档
        doc.end();
      } catch (error) {
        logger.error('PDF generation error:', error);
        reject(error);
      }
    });
  }
  
  /**
   * 添加PDF页眉
   * @private
   */
  static _addHeader(doc, title) {
    // 添加logo
    try {
      const logoPath = path.join(__dirname, '../assets/images/logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 150 });
      }
    } catch (error) {
      logger.warn('Could not load logo image:', error.message);
    }
    
    // 添加标题
    doc.fontSize(20)
       .font('BoldFont')
       .text(title, 250, 60, { align: 'right' });
       
    // 添加分隔线
    doc.moveTo(50, 100)
       .lineTo(550, 100)
       .stroke();
  }
  
  /**
   * 添加客户信息部分
   * @private
   */
  static _addClientInfo(doc, client, language) {
    doc.fontSize(16)
       .font('BoldFont')
       .text(t('assessment.clientInfo', 'Client Information', {}, language), 50, 120);
    
    doc.font('NormalFont')
       .fontSize(12)
       .moveDown();
       
    const clientInfo = [
      `${t('client.name', 'Name', {}, language)}: ${client.firstName} ${client.lastName}`,
      `${t('client.email', 'Email', {}, language)}: ${client.email}`,
      `${t('client.citizenship', 'Citizenship', {}, language)}: ${client.citizenship || t('common.notSpecified', 'Not specified', {}, language)}`,
      `${t('client.currentCountry', 'Current Country', {}, language)}: ${client.currentCountry || t('common.notSpecified', 'Not specified', {}, language)}`,
      `${t('client.age', 'Age', {}, language)}: ${client.age || t('common.notSpecified', 'Not specified', {}, language)}`,
      `${t('client.education', 'Education', {}, language)}: ${client.highestEducation || t('common.notSpecified', 'Not specified', {}, language)}`,
    ];
    
    clientInfo.forEach(info => {
      doc.text(info);
      doc.moveDown(0.5);
    });
    
    doc.moveDown();
  }
  
  /**
   * 添加评估摘要部分
   * @private
   */
  static _addAssessmentSummary(doc, assessment, language) {
    doc.fontSize(16)
       .font('BoldFont')
       .text(t('assessment.summary', 'Assessment Summary', {}, language));
    
    doc.font('NormalFont')
       .fontSize(12)
       .moveDown();
    
    // 提取评估摘要 (简化实现)
    const content = assessment.content;
    
    // 尝试从内容中提取总结部分
    let summary = '';
    if (typeof content === 'string') {
      const summaryMatch = content.match(/Summary:(.*?)(?=\n\n|\n[A-Z]|\n\d\.|$)/is);
      summary = summaryMatch ? summaryMatch[1].trim() : content.substring(0, 500);
    } else if (content && content.summary) {
      summary = content.summary;
    }
    
    doc.text(summary, {
      align: 'justify'
    });
    
    doc.moveDown(2);
  }
  
  /**
   * 添加评估详细内容
   * @private
   */
  static _addAssessmentDetails(doc, assessment, language) {
    doc.fontSize(16)
       .font('BoldFont')
       .text(t('assessment.details', 'Detailed Assessment', {}, language));
    
    doc.font('NormalFont')
       .fontSize(12)
       .moveDown();
    
    // 添加评估详情
    if (typeof assessment.content === 'string') {
      // 分段处理文本，防止过长段落
      const paragraphs = assessment.content.split('\n\n');
      paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
          // 检查是否需要开始新页
          if (doc.y > 700) {
            doc.addPage();
            this._addHeader(doc, t('assessment.reportTitle', 'Immigration Assessment Report', {}, language));
          }
          
          doc.text(paragraph.trim(), {
            align: 'justify'
          });
          doc.moveDown();
        }
      });
    } else if (assessment.content && typeof assessment.content === 'object') {
      // 处理结构化内容
      Object.entries(assessment.content).forEach(([key, value]) => {
        if (key !== 'summary') {
          // 检查是否需要开始新页
          if (doc.y > 700) {
            doc.addPage();
            this._addHeader(doc, t('assessment.reportTitle', 'Immigration Assessment Report', {}, language));
          }
          
          doc.font('BoldFont')
             .text(this._formatSectionTitle(key), {
               underline: true
             });
             
          doc.font('NormalFont')
             .moveDown(0.5);
             
          if (Array.isArray(value)) {
            value.forEach(item => {
              doc.text(`• ${item}`);
              doc.moveDown(0.25);
            });
          } else {
            doc.text(value);
          }
          
          doc.moveDown();
        }
      });
    }
  }
  
  /**
   * 格式化章节标题
   * @private
   */
  static _formatSectionTitle(key) {
    return key.split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
  }
  
  /**
   * 添加页脚
   * @private
   */
  static _addFooter(doc, language) {
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      
      // 添加页脚线
      doc.moveTo(50, 780)
         .lineTo(550, 780)
         .stroke();
      
      // 添加页码
      doc.fontSize(10)
         .text(
           t('common.page', 'Page {{page}} of {{total}}', { page: i + 1, total: pageCount }, language),
           50, 
           790, 
           { align: 'center', width: 500 }
         );
      
      // 添加版权信息
      doc.fontSize(8)
         .text(
           t('common.copyright', '© {{year}} ThinkForward AI - This document was generated by AI and should be reviewed by a professional.', { year: new Date().getFullYear() }, language),
           50,
           805,
           { align: 'center', width: 500 }
         );
    }
  }
}

module.exports = PDFGenerator;  