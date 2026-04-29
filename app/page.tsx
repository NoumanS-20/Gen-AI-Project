'use client';

import { useState } from 'react';
import Onboarding from '@/components/Onboarding';
import AppShell from '@/components/AppShell';

export default function Home() {
  const [onboarded, setOnboarded] = useState(false);

  if (!onboarded) {
    return <Onboarding onComplete={() => setOnboarded(true)} />;
  }

  return <AppShell />;
}
