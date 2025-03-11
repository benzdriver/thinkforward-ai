const express = require('express');
const router = express.Router();
const i18nCompatibility = require('../middleware/i18nCompatibility');
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// 将i18n兼容中间件应用到所有路由
router.use(i18nCompatibility);

// 公开路由
router.get('/me', auth, userController.getCurrentUser);
router.post('/profile', auth, userController.updateUserProfile);
router.get('/role', auth, userController.getCurrentUserRole);
router.get('/permissions', auth, userController.getCurrentUserPermissions);

// 受限路由 - 仅管理员或顾问
router.get('/consultants', auth, requireRole('Admin', 'Consultant'), userController.getConsultants);
router.get('/clients', auth, requireRole('Admin', 'Consultant'), userController.getClients);
router.post('/assign-consultant', auth, requireRole('Admin', 'Consultant'), userController.assignConsultant);

// 管理员专用路由
router.get('/all', auth, requireRole('Admin'), userController.getAllUsers);
router.put('/:id/role', auth, requireRole('Admin'), userController.updateUserRole);
router.post('/invite', auth, requireRole('Admin'), userController.inviteUser);

module.exports = router; 