'use client';

import { useEffect, useState } from 'react';
import PointDistributionHistory from './components/PointDistributionHistory';
import ManageRewards from './components/ManageRewards';
import { fetchTotalDistributedPoints, fetchRedemptionRequests } from '@/utils/actions';

export default function MemberLoyaltyOverview() {
  const [totalDistributedPoints, setTotalDistributedPoints] = useState(0);
  const [redemptionRequests, setRedemptionRequests] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'' | 'today' | 'week' | 'month'>('');
  const [showManageRewards, setShowManageRewards] = useState(false);

  useEffect(() => {
    const fetchLoyaltyOverviewData = async () => {
      try {
        const totalDistributedPoints = await fetchTotalDistributedPoints(selectedPeriod)
        const redemptionRequests = await fetchRedemptionRequests(selectedPeriod)
        setTotalDistributedPoints(totalDistributedPoints)
        setRedemptionRequests(redemptionRequests)
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
      {!showManageRewards ? (
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
            <div className="p-4 bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-800">
              <h3 className="text-gray-600 dark:text-gray-300">Total Point Distributed</h3>
              <p className="text-2xl font-bold dark:text-white">{totalDistributedPoints}</p>
            </div>
            <div className="p-4 bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-800">
              <h3 className="text-gray-600 dark:text-gray-300">Reward Redemption Request</h3>
              <p className="text-2xl font-bold dark:text-white">{redemptionRequests}</p>
            </div>
          </div>

          <button
            onClick={() => setShowManageRewards(true)}
            className="w-full sm:w-auto mb-4 px-4 py-2 bg-[#B5A17C] text-white rounded-md hover:opacity-90"
          >
            Manage Rewards
          </button>

          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex gap-4">
              <div className="py-2 px-4 border-b-2 border-[#B5A17C] text-[#B5A17C]">
                Point Distribution History
              </div>
            </div>
          </div>

          <PointDistributionHistory />
        </>
      ) : (
        <ManageRewards />
      )}
    </div>
  );
}
