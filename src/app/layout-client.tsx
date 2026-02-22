'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

export function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
