import { useI18n } from '@/hooks/useI18n';

describe('i18n 类型增强', () => {
  it('应支持嵌套路径', () => {
    const { t } = useI18n();
    // 测试类型提示和返回值
    const value = t('common:button.submit'); 
    expect(typeof value).toBe('string');
  });

  it('应支持插值参数类型检查', () => {
    const { t } = useI18n();
    // @ts-expect-error 应检测到缺少 count 参数
    t('cart.items', { item: 3 });
    // 正确用法
    t('cart.items', { count: 3 });
  });
}); 