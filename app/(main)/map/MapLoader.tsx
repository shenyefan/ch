'use client';

import dynamic from 'next/dynamic';

import type { Language } from '@/lib/i18n';

const MapExplorerClient = dynamic(() => import('./MapExplorerClient'), { ssr: false });

export default function MapLoader({ language }: { language: Language }) {
  return <MapExplorerClient language={language} />;
}
