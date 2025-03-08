const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// 公开路由
router.get('/me', auth, userController.getCurrentUser);
router.post('/profile', auth, userController.updateProfile);

// 受限路由 - 仅管理员或顾问
router.get('/consultants', auth, userController.getConsultants);
router.get('/clients', auth, userController.getClients);
router.post('/assign-consultant', auth, userController.assignConsultant);

// 管理员专用路由
router.put('/role/:userId', auth, userController.updateUserRole);
router.get('/all', auth, userController.getAllUsers);
router.delete('/:userId', auth, userController.deleteUser);

module.exports = router; 