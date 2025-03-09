const { setupDatabase, teardownDatabase } = require('./setup');

// 全局钩子
before(async function() {
  // 增加超时时间，因为数据库设置可能需要时间
  this.timeout(15000);
  await setupDatabase();
});

after(async function() {
  await teardownDatabase();
}); 