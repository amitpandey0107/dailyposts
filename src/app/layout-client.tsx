'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';

export function RootLayoutClient({ children, fontVariables }: { children: ReactNode; fontVariables: string }) {
  return (
    <div className={`${fontVariables} antialiased`}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  );
}
