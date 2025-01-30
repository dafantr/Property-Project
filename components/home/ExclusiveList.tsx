"use client";

import { exclusiveCategories } from "@/utils/exclusiveCategories";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

function ExclusiveList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const exclusive = searchParams.get("exclusive") || "";
  const search = searchParams.get("search") || "";

  const handleCategoryChange = (selectedExclusive: string) => {
    const params = new URLSearchParams(searchParams);

    if (selectedExclusive === exclusive) {
      params.delete("exclusive"); // Remove if the same category is clicked
    } else {
      params.set("exclusive", selectedExclusive);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false }); // 👈 Prevent scrolling to top
  };

  return (
    <section>
      <ScrollArea className="py-6">
        <div className="flex gap-x-6 justify-center">
          {exclusiveCategories.map((item) => {
            const isActive = item.label === exclusive;
            return (
              <button
                key={item.label}
                onClick={() => handleCategoryChange(item.label)}
                className={`p-3 flex flex-col items-center cursor-pointer duration-300 hover:text-primary w-[120px] ${
                  isActive ? "text-primary" : ""
                }`}
              >
                <item.icon className="w-8 h-8" />
                <p className="capitalize text-sm mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.label}
                </p>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

export default ExclusiveList;
