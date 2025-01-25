'use client';

import React, { useEffect, useState } from 'react';
import { fetchPointTransactionHistory } from '@/utils/actions';
import TransactionDetailsDialog from './TransactionDetailsDialog';

interface DistributionData {
  id: string;
  name: string;
  memberId: string;
  pointsRedeemed: number;
  rewardName: string;
  dateTime: Date;
}

const PointDistributionHistory = () => {
  const [distributionData, setDistributionData] = useState<DistributionData[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<DistributionData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPointTransactionHistory();
      setDistributionData(data);
    };
    fetchData();
  }, []);

  const handleView = (transaction: DistributionData) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white dark:bg-black rounded-lg p-4 mt-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Point Distribution History</h2>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or ID"
          className="p-2 border rounded-md dark:bg-black dark:border-gray-800 dark:text-white dark:placeholder-gray-500"
        />
        <select className="p-2 border rounded-md dark:bg-black dark:border-gray-800 dark:text-white">
          <option value="">Filter by Points Range</option>
        </select>
        <select className="p-2 border rounded-md dark:bg-black dark:border-gray-800 dark:text-white">
          <option value="">Filter by Reward</option>
        </select>
        <select className="p-2 border rounded-md dark:bg-black dark:border-gray-800 dark:text-white">
          <option value="">Filter by Date</option>
        </select>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b dark:border-gray-800">
              <th className="text-left p-3 dark:text-white">Name</th>
              <th className="text-left p-3 dark:text-white">Member ID</th>
              <th className="text-left p-3 dark:text-white">Points Redeemed</th>
              <th className="text-left p-3 dark:text-white">Reward Name</th>
              <th className="text-left p-3 dark:text-white">Date / Time</th>
              <th className="text-left p-3 dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {distributionData.map((item) => (
              <tr key={item.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="p-3 dark:text-gray-300">{item.name}</td>
                <td className="p-3 dark:text-gray-300">{item.memberId}</td>
                <td className="p-3 dark:text-gray-300">{item.pointsRedeemed}</td>
                <td className="p-3 dark:text-gray-300">{item.rewardName}</td>
                <td className="p-3 dark:text-gray-300">
                  {new Date(item.dateTime).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  }).replace(',', '/').replace(/\//g, '-').replace('-/', '/')}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleView(item)}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransactionDetailsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default PointDistributionHistory;