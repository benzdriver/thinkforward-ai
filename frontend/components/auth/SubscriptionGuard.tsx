import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  minimumPlan?: 'starter' | 'growth' | 'professional';
  fallbackMessage?: string;
  showUpgradeButton?: boolean;
}

/**
 * 订阅守卫组件
 * 根据用户订阅计划控制内容访问
 */
export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
  minimumPlan = 'starter',
  fallbackMessage,
  showUpgradeButton = true
}) => {
  const { subscriptionPlan, hasBasePermission } = usePermissions();
  const { t } = useTranslation(['common']);
  
  // 订阅等级映射
  const planLevels = {
    'free': 0,
    'starter': 1,
    'growth': 2,
    'professional': 3
  };
  
  // 检查用户订阅是否满足最低要求
  const hasRequiredPlan = planLevels[subscriptionPlan as keyof typeof planLevels] >= planLevels[minimumPlan as keyof typeof planLevels];
  
  // 检查用户是否有权限访问高级功能
  const canAccessPremium = hasBasePermission('canAccessPremiumFeatures');
  
  if (hasRequiredPlan && canAccessPremium) {
    return <>{children}</>;
  }
  
  // 如果没有权限，显示升级提示
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {fallbackMessage || t('subscription.premium_feature')}
      </h3>
      <p className="text-gray-600 mb-4">
        {t('subscription.upgrade_message', { plan: t(`subscription.plans.${minimumPlan}`) })}
      </p>
      {showUpgradeButton && (
        <Link href="/subscription" passHref>
          <Button variant="primary">
            {t('subscription.upgrade_now')}
          </Button>
        </Link>
      )}
    </div>
  );
}; 