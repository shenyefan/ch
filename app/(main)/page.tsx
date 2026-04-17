import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import CitiesSection from '@/components/home/CitiesSection';
import MarvelsSection from '@/components/home/MarvelsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaSection from '@/components/home/CtaSection';
import { getPreferredLanguage } from '@/lib/i18n-server';

export default async function Home() {
  const language = await getPreferredLanguage();

  return (
    <>
      <HeroSection language={language} />
      <AboutSection language={language} />
      <CitiesSection language={language} />
      <MarvelsSection language={language} />
      <TestimonialsSection language={language} />
      <CtaSection language={language} />
    </>
  );
}


