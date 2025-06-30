'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui';

export function useHydratedUIStore() {
  const store = useUIStore();

  useEffect(() => {
    // Rehydrate the store on the client side
    useUIStore.persist.rehydrate();
  }, []);

  return store;
}

// Export the regular store for direct usage where hydration is not needed
export { useUIStore } from '@/store/ui'; 