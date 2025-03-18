import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useUserRole() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUserRole() {
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('/api/users/role');
        
        if (!response.ok) {
          throw new Error('Failed to fetch user role');
        }
        
        const data = await response.json();
        setRole(data.role);
        setUserId(data.userId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Error fetching user role:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRole();
  }, [user, isLoaded]);

  return { role, userId, isLoading, error };
} 