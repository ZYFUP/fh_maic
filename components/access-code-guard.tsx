'use client';

import { useEffect, useState, ReactNode } from 'react';
import { AccessCodeModal } from '@/components/access-code-modal';

export function AccessCodeGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<{
    enabled: boolean;
    authenticated: boolean;
    loading: boolean;
  }>({ enabled: false, authenticated: false, loading: true });

  async function checkStatus() {
    try {
      const res = await fetch('/api/access-code/status');
      const data = await res.json();
      setStatus({ enabled: data.enabled, authenticated: data.authenticated, loading: false });
    } catch {
      setStatus({ enabled: false, authenticated: false, loading: false });
    }
  }

  useEffect(() => {
    checkStatus();
  }, []);

  if (status.loading) {
    return null;
  }

  const needsAuth = status.enabled && !status.authenticated;

  return (
    <>
      {needsAuth && (
        <AccessCodeModal
          open={true}
          onSuccess={() => setStatus((s) => ({ ...s, authenticated: true }))}
        />
      )}
      {!needsAuth && children}
    </>
  );
}
