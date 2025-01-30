'use client';

import { useEffect, useState } from 'react';
import PointDistributionHistory from './components/PointDistributionHistory';
import ManageRewards from './components/ManageRewards';
import { fetchTotalDistributedPoints, fetchRedemptionHistory } from '@/utils/actions';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import RedemptionHistory from './components/RedemptionHistory';

type RedemptionHistoryData = {
  id: string;
  member: {
    profile: {  
      firstName: string;
      lastName: string;
    };
    memberId: string;
  } | null;
  reward: {
    rewardName: string;
    pointReq: number;
  };
  createdAt: Date;
}

export default function MemberLoyaltyOverview() {
  const [totalDistributedPoints, setTotalDistributedPoints] = useState(0);
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionHistoryData[]>();
  const [selectedPeriod, setSelectedPeriod] = useState<'' | 'today' | 'week' | 'month'>('');
  const [showManageRewards, setShowManageRewards] = useState(false);
  const [selectedTab, setSelectedTab] = useState('pointDistribution');
  

  useEffect(() => {
    const fetchLoyaltyOverviewData = async () => {
      try {
        const totalDistributedPoints = await fetchTotalDistributedPoints(selectedPeriod)
        const redemptionHistory = await fetchRedemptionHistory(selectedPeriod)
        setTotalDistributedPoints(totalDistributedPoints)
        setRedemptionHistory(redemptionHistory)
      } catch (error) {
        console.error('Error fetching loyalty overview data:', error)
      }
    }
    fetchLoyaltyOverviewData()
  }, [selectedPeriod])

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value as '' | 'today' | 'week' | 'month');
  };

  return (
    <div className="p-6 dark:bg-black">
      {showManageRewards ? (
        <>
          <button onClick={() => setShowManageRewards(false)} className="flex items-center gap-2 mb-4"><ArrowLeftIcon className="w-4 h-4" /> Back</button>
          <ManageRewards />
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Member Loyalty Points Overview</h1>

          <div className="mb-4">
            <select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              className="w-full sm:w-48 p-2 border rounded-md dark:bg-black dark:text-white dark:border-gray-700"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-black p-4 rounded-lg shadow dark:shadow-gray-800 border dark:border-gray-700">
              <h3 className="text-gray-600 dark:text-gray-300">Total Point Distributed</h3>
              <p className="text-2xl font-bold dark:text-white">{totalDistributedPoints}</p>
            </div>
            <div className="bg-white dark:bg-black p-4 rounded-lg shadow dark:shadow-gray-800 border dark:border-gray-700">
              <h3 className="text-gray-600 dark:text-gray-300">Reward Redemption History</h3>
              <p className="text-2xl font-bold dark:text-white">{redemptionHistory?.length}</p>
            </div>
          </div>

          <button
            onClick={() => setShowManageRewards(true)}
            className="w-full sm:w-auto mb-4 px-4 py-2 bg-[#B5A17C] text-white rounded-md hover:opacity-90"
          >
            Manage Rewards
          </button>

          <div className="flex flex-wrap gap-2 border-b overflow-x-auto pb-2 justify-left">
            <button
              onClick={() => setSelectedTab('pointDistribution')}
              className={`px-3 py-2 text-sm sm:text-base sm:px-4 whitespace-nowrap ${
                selectedTab === 'pointDistribution'
                  ? 'border-b-2 border-[#B69C71] text-[#B69C71]'
                  : 'text-gray-500 hover:text-[#B69C71]'
              } font-medium`}
            >
              Point Distribution History
            </button>
            <button
              onClick={() => setSelectedTab('redemptionHistory')}
              className={`px-3 py-2 text-sm sm:text-base sm:px-4 whitespace-nowrap ${
                selectedTab === 'redemptionHistory'
                  ? 'border-b-2 border-[#B69C71] text-[#B69C71]'
                  : 'text-gray-500 hover:text-[#B69C71]'
              }`}
            >
              Reward Redemption History
            </button>
          </div>

          {selectedTab === 'pointDistribution' ? ( 
            <PointDistributionHistory />
          ) : (
            <RedemptionHistory />
          )}
        </>
      )}
    </div>
  );
}
