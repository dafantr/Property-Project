import CategoriesList from '@/components/home/CategoriesList';
import PropertiesContainer from '@/components/home/PropertiesContainer';
import LoadingCards from '@/components/card/LoadingCards';
import { Suspense } from 'react';
import FeatureHighlights from '@/components/features/FeatureHighlights';

function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  return (
    <section>
<FeatureHighlights />
      <CategoriesList
        category={searchParams?.category}
        search={searchParams?.search}
      />
      <Suspense fallback={<LoadingCards />}>
        <PropertiesContainer
          category={searchParams?.category}
          search={searchParams?.search}
        />
      </Suspense>
    </section>
  );
}
export default HomePage;

