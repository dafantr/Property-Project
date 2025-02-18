"use client";

import { exclusiveCategories } from "@/utils/exclusiveCategories";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface ExclusiveListProps {
  exclusive?: string;
}

function ExclusiveList({ exclusive }: ExclusiveListProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const selectedExclusive = searchParams.get("exclusive") || exclusive || "";

  const handleCategoryChange = (selectedExclusive: string) => {
    const params = new URLSearchParams(searchParams);

    if (selectedExclusive === exclusive) {
      params.delete("exclusive"); // If the same category is clicked, remove it
    } else {
      params.set("exclusive", selectedExclusive);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section>
      <ScrollArea className="py-6">
        <div className="flex gap-x-6 justify-center">
          {exclusiveCategories.map((item) => {
            const isActive = item.url === selectedExclusive;
            return (
              <button
                key={item.url}
                onClick={() => handleCategoryChange(item.url)}
                className={`p-3 flex flex-col items-center cursor-pointer duration-300 hover:text-primary w-[100px] ${
                  isActive ? "text-primary" : ""
                }`}
              >
                {/* ✅ Render Category Icon */}
                <item.icon className="w-6 h-6 mb-1" /> 
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

export default ExclusiveList;