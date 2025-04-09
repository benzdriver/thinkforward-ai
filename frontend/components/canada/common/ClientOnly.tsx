import React, { useEffect, useState, ReactNode, Fragment } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly component
 * Renders children only on the client-side to prevent hydration errors
 * with components that access browser APIs (like recharts)
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <Fragment>{children}</Fragment> : <Fragment>{fallback}</Fragment>;
}

export default ClientOnly;
