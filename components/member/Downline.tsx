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
                <div className="flex items-center justify-center w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 rounded-full border-2 border-[#C4A777] bg-white dark:bg-zinc-800 shadow-md">
                <div className="text-center">
                    <User className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 mx-auto mb-1 md:mb-2 text-[#C4A777]" />
                    <p className="text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[100px]">{member.name}</p>
                    <p className="text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[100px]">{member.memberId}</p>
                    {hasDownlines && (
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="mt-1 md:mt-2 text-gray-500 hover:text-[#C4A777]"
                    >
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    )}
                </div>
                </div>
                {/* Downlines Container */}
                {isOpen && hasDownlines && (
                <>
                    {/* Vertical Line */}
                    <div className="w-px h-4 sm:h-6 md:h-8 bg-[#C4A777]" />
                    
                    {/* Horizontal Line Container */}
                    <div className="relative flex overflow-x-auto pb-4">
                        {/* Horizontal Lines */}
                        {member.downlines && member.downlines.length > 1 && (
                            <div className="absolute top-0 left-1/2 h-px bg-[#C4A777]" 
                                style={{ 
                                width: `${(member.downlines.length - 1) * 200}px`,
                                transform: 'translateX(-50%)'
                                }} 
                            />
                        )}
                    
                        {/* Downline Nodes */}
                        <div className="flex gap-4 sm:gap-6 md:gap-8 min-w-max px-4">
                            {member.downlines?.map((downline, index) => (
                            <div key={downline.id} className="relative">
                                {/* Vertical Line to Child */}
                                <div className="absolute top-0 left-1/2 w-px h-4 sm:h-6 md:h-8 bg-[#C4A777] -translate-x-1/2" />
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