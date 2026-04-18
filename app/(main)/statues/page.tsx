import { getPreferredLanguage } from '@/lib/i18n-server';
import StatuesClient from './StatuesClient';

export default async function StatuesPage() {
  const language = await getPreferredLanguage();
  return <StatuesClient language={language} />;
}
