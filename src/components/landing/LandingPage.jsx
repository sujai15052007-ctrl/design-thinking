import React from 'react';
import LandingHero from './LandingHero';
import ProblemStory from './ProblemStory';
import AnimatedStats from './AnimatedStats';
import BentoFeatures from './BentoFeatures';
import TestimonialMarquee from './TestimonialMarquee';
import LandingCTA from './LandingCTA';

export default function LandingPage() {
  return (
    <div className="landing-page-wrapper">
      <LandingHero />
      <AnimatedStats />
      <ProblemStory />
      <BentoFeatures />
      <TestimonialMarquee />
      <LandingCTA />
    </div>
  );
}
