import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AiChat from '@/components/AiChat';
import { getPreferredLanguage } from '@/lib/i18n-server';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const language = await getPreferredLanguage();

  return (
    <>
      <Navbar initialLanguage={language} />
      <main>{children}</main>
      <Footer language={language} />
      <AiChat language={language} />
    </>
  );
}
