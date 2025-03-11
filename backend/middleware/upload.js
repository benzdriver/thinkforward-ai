const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const logger = require('../utils/logger');

// Cloudinary配置
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 根据文件类型决定存储文件夹
const getFolder = (fileType) => {
  switch(fileType) {
    case 'image/jpeg':
    case 'image/png': 
    case 'image/gif': return 'images';
    case 'application/pdf': return 'documents';
    default: return 'misc';
  }
};

// 创建存储
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    // 动态决定文件夹和格式
    folder: (req, file) => {
      const userType = req.user?.role || 'public';
      const fileCategory = getFolder(file.mimetype);
      return `thinkforward/${userType}/${fileCategory}`;
    },
    allowed_formats: ['jpg', 'png', 'pdf', 'jpeg', 'gif'],
    // 针对图片的转换设置
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    // 为文件名添加日期前缀防止重复
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = file.originalname.replace(/\.[^/.]+$/, "");
      return `${filename}-${uniqueSuffix}`;
    }
  }
});

// 创建上传中间件
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB上限，适合移民文档
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      logger.warn(`用户尝试上传不支持的文件类型: ${file.mimetype}`);
      cb(new Error('仅支持JPEG, PNG, GIF图片和PDF文档'), false);
    }
  }
});

module.exports = upload; 