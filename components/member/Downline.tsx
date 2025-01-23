"use client"
import { DownlineProps } from "@/utils/types";
import { ChevronDown, ChevronRight, Search, User } from "lucide-react";
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
      <div className="flex flex-col items-center transition-all duration-200">
        <div className="flex items-center justify-center w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 bg-white dark:bg-zinc-800 rounded-lg">
          <div className="text-center">
              {member.profile.profileImage ? (
                  <img src={member.profile.profileImage} alt="Profile Image" 
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-cover rounded-full p-1"/>
              ) : (
                  <User className="w-6 sm:w-7 md:w-8 lg:w-9 h-6 sm:h-7 md:h-8 lg:h-9 mx-auto mb-1 text-[#C4A777]" />
              )}
              <p className="text-xs sm:text-sm font-medium truncate max-w-[70px] sm:max-w-[80px] md:max-w-[90px] lg:max-w-[100px]">
                  {member.profile.firstName}</p>
              <p className="text-xs sm:text-sm font-medium truncate max-w-[70px] sm:max-w-[80px] md:max-w-[90px] lg:max-w-[100px]">
                  {member.memberId}</p>
              {hasDownlines && (
              <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-500 hover:text-[#C4A777]"
              >
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              )}
          </div>
        </div>
        
        {/* Downlines Container */}
        {isOpen && hasDownlines && (
        <>
          {/* Increase the vertical line height */}
          <div className="w-px h-8 sm:h-10 md:h-12 lg:h-14 bg-[#C4A777]" />
            
            <div className="relative flex overflow-x-auto"> {/* Increased padding bottom */}
            {member.downlines && member.downlines.length > 1 && (
                <div className="absolute top-0 left-1/2 h-px bg-[#C4A777]" 
                style={{ 
                    width: `${(member.downlines.length - 1) * 200}px`,
                    transform: 'translateX(-50%)'
                }} 
                />
            )}
            
            <div className="flex gap-[100px] sm:gap-[120px] md:gap-[140px] lg:gap-[160px] min-w-max px-2 sm:px-4"> {/* Increased gap */}
                {member.downlines?.map((downline) => (
                    <div key={downline.id} className="relative"> {/* Added margin top */}
                        <div className="absolute top-0 left-1/2 w-px h-8 sm:h-10 md:h-12 lg:h-14 bg-[#C4A777] -translate-x-1/2" />
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