'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchPointDistributionHistory } from '@/utils/actions';
import TransactionDetailsDialog from './TransactionDetailsDialog';
import { Slider } from '@mui/material';

interface DistributionData {
  id: string;
  name: string;
  memberId: string;
  type: string;
  point: number;
  dateTime: Date;
}

const PointDistributionHistory = () => {
  const [distributionData, setDistributionData] = useState<DistributionData[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<DistributionData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPointDistributionHistory();
      setDistributionData(data);

    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return distributionData.filter((item) => {
      const searchMatches = searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.memberId.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const dateMatches = startDate && endDate
        ? new Date(item.dateTime) >= new Date(startDate) &&
          new Date(item.dateTime) <= new Date(endDate)
        : true;

      return searchMatches && dateMatches;
    }) || [];
  }, [distributionData, searchQuery, startDate, endDate]);

  // Add paginated data calculation
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleView = (transaction: DistributionData) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery('')
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="bg-white dark:bg-black rounded-lg p-4 mt-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Point Distribution History</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
        <div className="w-full md:w-1/5">
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md w-full dark:bg-black dark:border-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        <div className="w-full md:w-2/5 flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-md dark:bg-black dark:border-gray-800 dark:text-white w-full"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-md dark:bg-black dark:border-gray-800 dark:text-white w-full"
            placeholder="End Date"
          />
        </div>
        <button
          onClick={resetFilters}
          className="bg-[#B69C6C] text-white px-4 py-2 rounded hover:bg-[#A58B5B] w-full sm:w-auto"
        >
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 sm:-mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead>
                <tr className="border-b dark:border-gray-800">
                  <th className="text-left p-3 dark:text-white">Name</th>
                  <th className="text-left p-3 dark:text-white">Member ID</th>
                  <th className="text-left p-3 dark:text-white">Points Redeemed</th>
                  <th className="text-left p-3 dark:text-white">Type</th>
                  <th className="text-left p-3 dark:text-white">Date / Time</th>
                  <th className="text-left p-3 dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-3 dark:text-gray-300">{item.name}</td>
                    <td className="p-3 dark:text-gray-300">{item.memberId}</td>
                    <td className="p-3 dark:text-gray-300">{item.point}</td>
                    <td className="p-3 dark:text-gray-300">{item.type}</td>
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
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 dark:text-white">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="border rounded p-1 dark:bg-black dark:border-gray-800"
          >
            {[5, 10, 25, 50].map((rows) => (
              <option key={rows} value={rows}>
                {rows}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <span className="whitespace-nowrap">
            {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredData.length)} of{' '}
            {filteredData.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Previous
            </button>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={(page + 1) * rowsPerPage >= filteredData.length}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Next
            </button>
          </div>
        </div>
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