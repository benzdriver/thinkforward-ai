/**
 * Subscription plan types
 */

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  recommended?: boolean;
  features: Array<{
    name: string;
    included?: boolean;
    value?: string;
  }>;
}

export interface SubscriptionStatus {
  active: boolean;
  planId: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
} 