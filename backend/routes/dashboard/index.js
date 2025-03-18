const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const { ROLES } = require('../../constants/roles');
const adminRoutes = require('./adminDashboardRoutes');
const consultantRoutes = require('./consultantDashboardRoutes');
const clientRoutes = require('./clientDashboardRoutes');
const guestRoutes = require('./guestDashboardRoutes');

// 公共仪表盘路由 - 无需认证
router.use('/guest', guestRoutes);

// 所有其他仪表盘路由需要身份验证
router.use(auth);

// 根据角色使用不同的子路由
router.use('/admin', adminRoutes);
router.use('/consultant', consultantRoutes);
router.use('/client', clientRoutes);

// 通用仪表盘路由 - 根据用户角色动态显示内容
router.get('/', (req, res) => {
  const userRole = req.user.role.toUpperCase();
  
  // 根据用户角色重定向到相应的仪表盘
  switch (userRole) {
    case ROLES.ADMIN:
      return res.redirect('/api/dashboard/admin/overview');
    case ROLES.CONSULTANT:
      return res.redirect('/api/dashboard/consultant/overview');
    case ROLES.CLIENT:
      return res.redirect('/api/dashboard/client/overview');
    default:
      return res.redirect('/api/dashboard/guest/overview');
  }
});

module.exports = router; 