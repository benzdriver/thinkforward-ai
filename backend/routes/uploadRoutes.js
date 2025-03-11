const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// 单文件上传
router.post('/file', auth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '没有文件被上传'
    });
  }
  
  return res.status(200).json({
    success: true,
    file: {
      url: req.file.path,
      publicId: req.file.filename
    }
  });
});

module.exports = router; 