import { HeroSection } from "../components/sections/HeroSection";
import { TrustStrip } from "../components/sections/TrustStrip";
import { HowItWorksSection } from "../components/sections/HowItWorksSection";
import { IncludedSection } from "../components/sections/IncludedSection";
import { LeadFormSection } from "../components/sections/LeadFormSection";
import { PortfolioSection } from "../components/sections/PortfolioSection";
import { WhySection } from "../components/sections/WhySection";
import { TestimonialsSection } from "../components/sections/TestimonialsSection";
import { BioSection } from "../components/sections/BioSection";
import { FaqSection } from "../components/sections/FaqSection";
import { ClosingCtaSection } from "../components/sections/ClosingCtaSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <HowItWorksSection />
      <IncludedSection />
      <LeadFormSection />
      <PortfolioSection />
      <WhySection />
      <TestimonialsSection />
      <BioSection />
      <FaqSection />
      <ClosingCtaSection />
    </>
  );
}
