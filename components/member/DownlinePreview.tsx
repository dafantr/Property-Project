"use client"
import { DownlineProps } from "@/utils/types";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useState } from "react";

export default function Downline({
	member,
    level = 0,
}: DownlineProps) {
    
    const [isOpen, setIsOpen] = useState(false);
    const hasDownlines = member.downlines && member.downlines.length > 0;
	return (
        <div className="relative">
            {/* Node */}
            <div className="flex flex-col items-center">
                {/* Reduced w-20/h-20 to w-16/h-16, and other size variants accordingly */}
                <div className="flex items-center justify-center w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border-2 border-[#C4A777] bg-white dark:bg-zinc-800 shadow-md">
                <div className="text-center">
                    {/* Reduced icon sizes */}
                    <User className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 mx-auto mb-1 text-[#C4A777]" />
                    {/* Reduced text sizes and max-widths */}
                    <p className="text-[7px] sm:text-xs font-medium truncate max-w-[60px] sm:max-w-[80px]">{member.name}</p>
                    <p className="text-[7px] sm:text-xs font-medium truncate max-w-[60px] sm:max-w-[80px]">{member.memberId}</p>
                    {hasDownlines && (
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="mt-1 text-gray-500 hover:text-[#C4A777]"
                    >
                        {/* Reduced chevron size */}
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    )}
                </div>
                </div>
                {/* Downlines Container */}
                {isOpen && hasDownlines && (
                <>
                    {/* Reduced vertical line height */}
                    <div className="w-px h-3 sm:h-4 md:h-6 bg-[#C4A777]" />
                    
                    <div className="relative flex overflow-x-auto pb-3">
                        {member.downlines && member.downlines.length > 1 && (
                            <div className="absolute top-0 left-1/2 h-px bg-[#C4A777]" 
                                style={{ 
                                // Reduced width between nodes
                                width: `${(member.downlines.length - 1) * 150}px`,
                                transform: 'translateX(-50%)'
                                }} 
                            />
                        )}
                    
                        {/* Reduced gaps between nodes */}
                        <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max px-3">
                            {member.downlines?.map((downline, index) => (
                            <div key={downline.id} className="relative">
                                {/* Reduced vertical line height */}
                                <div className="absolute top-0 left-1/2 w-px h-3 sm:h-4 md:h-6 bg-[#C4A777] -translate-x-1/2" />
                                <Downline member={downline} level={level + 1} />
                            </div>
                            ))}
                        </div>
                    </div>
                </>
                )}
            </div>
        </div>
	);
}