import { getPreferredLanguage } from '@/lib/i18n-server';

import MapLoader from './MapLoader';

export default async function MapPage() {
  const language = await getPreferredLanguage();

  return <MapLoader language={language} />;
}