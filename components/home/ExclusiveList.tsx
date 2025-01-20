'use client';

import { exclusiveCategories } from '@/utils/exclusiveCategories';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import Link from 'next/link';

interface ExclusiveListProps {
  exclusive?: string;
  search?: string;
  onCategorySelect?: (category: string) => void; // Optional for "More" page
}

function ExclusiveList({ exclusive, search, onCategorySelect }: ExclusiveListProps) {
  const searchTerm = search ? `&search=${search}` : '';

  return (
    <section>
      <ScrollArea className="py-6">
        <div className="flex gap-x-6 justify-center">
          {exclusiveCategories.map((item) => {
            const isActive = item.label === exclusive;

            if (onCategorySelect) {
              // For "More" page
              return (
                <article
                  key={item.label}
                  onClick={() => onCategorySelect(item.label)}
                  className={`p-3 flex flex-col items-center cursor-pointer duration-300 hover:text-primary w-[120px] ${
                    isActive ? 'text-primary' : ''
                  }`}
                >
                  <item.icon className="w-8 h-8" />
                  <p className="capitalize text-sm mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.label}
                  </p>
                </article>
              );
            } else {
              // For landing page
              return (
                <Link
                  key={item.label}
                  href={`/?exclusive=${item.url}${searchTerm}`}
                >
                  <article
                    className={`p-3 flex flex-col items-center cursor-pointer duration-300 hover:text-primary w-[120px] ${
                      isActive ? 'text-primary' : ''
                    }`}
                  >
                    <item.icon className="w-8 h-8" />
                    <p className="capitalize text-sm mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.label}
                    </p>
                  </article>
                </Link>
              );
            }
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

export default ExclusiveList;
