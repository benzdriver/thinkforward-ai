/**
 * 测试辅助函数集合
 */

// 创建带有t函数的请求模拟
const createMockRequest = (overrides = {}) => {
  return {
    user: null,
    headers: {},
    body: {},
    params: {},
    query: {},
    t: (key, defaultValue) => defaultValue || key,
    ...overrides
  };
};

// 创建响应模拟
const createMockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  res.send = sinon.stub().returns(res);
  return res;
};

module.exports = {
  createMockRequest,
  createMockResponse
}; 