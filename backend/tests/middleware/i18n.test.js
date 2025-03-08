const i18nMiddleware = require('../../middleware/i18n');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');

describe('I18n中间件测试', () => {
  it('应从Accept-Language头部识别语言', () => {
    const req = httpMocks.createRequest({
      headers: {
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    
    i18nMiddleware(req, res, next);
    
    expect(req.language).to.equal('zh');
    expect(typeof req.t).to.equal('function');
    expect(next.calledOnce).to.be.true;
  });
  
  it('应从query参数识别语言', () => {
    const req = httpMocks.createRequest({
      query: {
        lang: 'zh'
      }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    
    i18nMiddleware(req, res, next);
    
    expect(req.language).to.equal('zh');
    expect(next.calledOnce).to.be.true;
  });
  
  it('没有语言参数时使用默认语言', () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    
    i18nMiddleware(req, res, next);
    
    expect(req.language).to.equal('en');  // 默认英语
    expect(next.calledOnce).to.be.true;
  });
  
  it('不支持的语言应使用默认语言', () => {
    const req = httpMocks.createRequest({
      query: {
        lang: 'fr'  // 不支持的法语
      }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    
    i18nMiddleware(req, res, next);
    
    expect(req.language).to.equal('en');  // 默认回退到英语
    expect(next.calledOnce).to.be.true;
  });
}); 