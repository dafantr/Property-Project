'use client';
import { useState } from 'react';
import { fetchMember, fetchDownlines, fetchAdminMemberDownline } from "@/utils/actions";
import Downline from "@/components/member/Downline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuSearch } from "react-icons/lu";
import { DownlineProps, profile } from '@/utils/types';


export default function AdminDownlinePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [downlines, setDownlines] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const member = await fetchAdminMemberDownline(searchQuery);
      if (member === null) {
        setError('Member not found');
        setSelectedMember(null);
        setDownlines(null);
        return;
      }

      const memberDownlines = await fetchDownlines(member.id, 3);
      if (memberDownlines === null) {
        setError('Failed to fetch downlines');
        return;
      }

      console.log(member)
      console.log(memberDownlines)

      setSelectedMember(member);
      setDownlines(memberDownlines);
    } catch (err) {
      setError('An error occurred while searching');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
        <h1 className="text-xl font-semibold mb-4 dark:text-white">
          Referral Tree Search
        </h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter member ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button 
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-[#C4A777] text-white"
            >
              <LuSearch className="w-4 h-4" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}

        {/* Selected Member Info */}
        {selectedMember && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-zinc-700/50 rounded-lg">
            <h2 className="font-medium dark:text-white">Selected Member:</h2>
            <p className="dark:text-gray-300">
              {selectedMember.profile.firstName} {selectedMember.profile.lastName} ({selectedMember.memberId})
            </p>
          </div>
        )}

        {/* Downline Tree */}
        {downlines && (
          <div className="relative w-full overflow-auto p-8">
            <div className="min-w-max flex justify-center">
              <Downline member={downlines} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}