/**
 * Clerk 服务模拟 (Sinon 版本)
 * 为 Mocha/Sinon 测试环境设计
 */
const createClerkMock = () => {
  return {
    users: {
      getUser: () => {}
    },
    verifyToken: () => {}
  };
};

module.exports = createClerkMock; 