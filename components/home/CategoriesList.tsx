"use client";

import { categories } from "@/utils/categories";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

function CategoriesList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const handleCategoryChange = (selectedCategory: string) => {
    const params = new URLSearchParams(searchParams);

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
