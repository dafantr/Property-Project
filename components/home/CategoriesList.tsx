"use client";

import { categories } from "@/utils/categories";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";

interface CategoriesListProps {
  category?: string;
  search?: string;
}

function CategoriesList({ category = "", search = "" }: CategoriesListProps) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleCategoryChange = (selectedCategory: string) => {
    const params = new URLSearchParams();
    
    if (search) params.set("search", search); // Preserve search query

    if (selectedCategory === category) {
      params.delete("category"); // If the same category is clicked, remove it
    } else {
      params.set("category", selectedCategory);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false }); // 👈 Prevents scrolling to top
  };

  return (
    <section>
      <ScrollArea className="py-6">
        <div className="flex gap-x-4 justify-center">
          {categories.map((item) => {
            const isActive = item.label === category;
            return (
              <button
                key={item.label}
                onClick={() => handleCategoryChange(item.label)}
                className={`p-3 flex flex-col items-center cursor-pointer duration-300 hover:text-primary w-[100px] ${
                  isActive ? "text-primary" : ""
                }`}
              >
                <item.icon className="w-8 h-8" />
                <p className="capitalize text-sm mt-1">{item.label}</p>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

export default CategoriesList;