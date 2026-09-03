import { SofiaWelcomeHeroSection } from '@/features/sofia-welcome/sections/sofia-welcome-hero-section';
import { useSofiaWelcomeController } from '@/features/sofia-welcome/sofia-welcome.controller';

export default function SofiaWelcomePage() {
  const controller = useSofiaWelcomeController();

  return <SofiaWelcomeHeroSection controller={controller} />;
}
