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

// 用于调试测试过程中的对象
const inspect = (obj, name = 'Object') => {
    console.log(`\n----- ${name} -----`);
    try {
      console.log(JSON.stringify(obj, null, 2));
    } catch (e) {
      console.log(`${name} contains circular reference or non-serializable values`);
      console.log(obj);
    }
    console.log(`----- End ${name} -----\n`);
  };

module.exports = {
  createMockRequest,
  createMockResponse,
  inspect
}; 