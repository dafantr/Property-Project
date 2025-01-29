import { fetchProperties } from '@/utils/actions';
import PropertiesList from './PropertiesList';
import EmptyList from './EmptyList';
import type { PropertyCardProps } from '@/utils/types';

async function PropertiesContainer({
  category,
  search,
}: {
  category?: string;
  search?: string;
}) {
  const properties: PropertyCardProps[] = await fetchProperties({
    category,
    search,
  });

  // Sorting properties by createdAt in descending order
  const sortedProperties = properties.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedProperties.length === 0) {
    return (
      <EmptyList
        heading="No results."
        message="Try finding different property or removing some of your filters."
        btnText="Clear Filters"
      />
    );
  }

  const displayedProperties = sortedProperties.slice(0, 4);

  return (
    <div>
      <PropertiesList properties={displayedProperties} />

      {/* View More Button - Always shown */}
      <div className="flex justify-end mt-4 px-4">
        <a
                    href="/properties/more"
                    className="flex items-center border py-2 px-6 gap-2 rounded inline-flex hover:bg-opacity-10 transition"
                    style={{
                        color: 'rgba(194, 171, 125, 1)', // Text and icon color
                        borderColor: 'rgba(194, 171, 125, 1)', // Border color
                        backgroundColor: 'transparent',
                    }}
                >
          <span>View More</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}

export default PropertiesContainer;
