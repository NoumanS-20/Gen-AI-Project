'use client';

import Onboarding from '@/components/screens/Onboarding';
import AppShell from '@/components/AppShell';
import { useStore } from '@/lib/store';

export default function Home() {
  const { onboarded, setOnboarded } = useStore();

  if (!onboarded) {
    return <Onboarding onComplete={() => setOnboarded(true)} />;
  }

  return <AppShell />;
}
