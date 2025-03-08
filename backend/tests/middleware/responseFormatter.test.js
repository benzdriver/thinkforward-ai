const responseFormatter = require('../../middleware/responseFormatter');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');

describe('响应格式化中间件测试', () => {
  it('应该正确格式化成功响应', () => {
    const req = httpMocks.createRequest({
      t: (key, defaultValue) => key === 'api.success' ? '操作成功' : defaultValue
    });
    const res = httpMocks.createResponse();
    res.statusCode = 200;
    
    const jsonSpy = sinon.spy(res, 'json');
    const next = sinon.spy();
    
    responseFormatter(req, res, next);
    res.json({ items: [1, 2, 3] });
    
    expect(next.calledOnce).to.be.true;
    expect(jsonSpy.calledOnce).to.be.true;
    
    const responseData = jsonSpy.args[0][0];
    expect(responseData).to.have.property('success', true);
    expect(responseData).to.have.property('message', '操作成功');
    expect(responseData).to.have.property('data').that.deep.equals({ items: [1, 2, 3] });
    expect(responseData).to.have.property('error', null);
  });

  it('应该正确格式化客户端错误响应', () => {
    const req = httpMocks.createRequest({
      t: (key, defaultValue) => key === 'api.clientError' ? '请求错误' : defaultValue
    });
    const res = httpMocks.createResponse();
    res.statusCode = 400;
    
    const jsonSpy = sinon.spy(res, 'json');
    
    responseFormatter(req, res, () => {});
    res.json({ message: '无效的参数' });
    
    const responseData = jsonSpy.args[0][0];
    expect(responseData).to.have.property('success', false);
    expect(responseData).to.have.property('message', '请求错误');
    expect(responseData).to.have.property('data', null);
    expect(responseData).to.have.property('error', '无效的参数');
  });

  it('应该正确格式化服务器错误响应', () => {
    const req = httpMocks.createRequest({
      t: (key, defaultValue) => key === 'api.serverError' ? '服务器错误' : defaultValue
    });
    const res = httpMocks.createResponse();
    res.statusCode = 500;
    
    const jsonSpy = sinon.spy(res, 'json');
    
    responseFormatter(req, res, () => {});
    res.json({ message: '数据库连接失败' });
    
    const responseData = jsonSpy.args[0][0];
    expect(responseData).to.have.property('success', false);
    expect(responseData).to.have.property('message', '服务器错误');
    expect(responseData).to.have.property('data', null);
    expect(responseData).to.have.property('error', '数据库连接失败');
  });

  it('不应该包装已经格式化的响应', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    
    const jsonSpy = sinon.spy(res, 'json');
    
    responseFormatter(req, res, () => {});
    
    const formattedResponse = {
      success: true,
      message: '自定义消息',
      data: { custom: 'data' },
      error: null
    };
    
    res.json(formattedResponse);
    
    expect(jsonSpy.calledOnce).to.be.true;
    expect(jsonSpy.args[0][0]).to.deep.equal(formattedResponse);
  });
}); 