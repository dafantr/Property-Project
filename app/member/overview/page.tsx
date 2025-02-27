//"use client";
import SectionHeading from '@/components/helper/SectionHeading';
import 'aos/dist/aos.css';
import OverviewHero from '@/components/hero/OverviewHero';
import GettingStarted from '@/components/home/GettingStarted';
import MemberOverviewFeatureHighlight from '@/components/features/MemberOverviewFeatureHighlight';
import MemberReviews from '@/components/home/MemberReviews';
export default async function OverviewPage() {
  return (
    <section>
      <OverviewHero />
      <div id="about">
        <MemberOverviewFeatureHighlight />
      </div>
      <div id="steps">
        <SectionHeading
          heading="How it works"
          paragraph="Getting started is easy - Follow these simple steps to unlock exclusive rewards."
        />
        <GettingStarted />
      </div>
      <div id="highlights" className="mt-10 mb-10">
        <SectionHeading
          heading="What our members are saying"
          paragraph="Discover how the MDV Membership has transformed the experiences of our valued members."
        />
        <MemberReviews />
      </div>
    </section>
  );
}

