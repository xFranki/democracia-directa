import { HeroSection } from '@/components/layout/HeroSection';
import { WhySection } from '@/components/layout/WhySection';
import { HowItWorksSection } from '@/components/layout/HowItWorksSection';
import { BlockchainLiveSection } from '@/components/blockchain/BlockchainLiveSection';
import { CtaSection } from '@/components/layout/CtaSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <HowItWorksSection />
      <BlockchainLiveSection />
      <CtaSection />
    </>
  );
}
