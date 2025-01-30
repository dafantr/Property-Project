import { fetchRedemptionHistory } from '@/utils/actions';
import React, { useMemo, useState, useEffect } from 'react';

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

const RedemptionHistory = () => {
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionHistoryData[]>();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRedemptionHistory();
      setRedemptionHistory(data);

    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return redemptionHistory ?.filter((item) => {
      const searchMatches = searchQuery
        ? item.member?.profile?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.member?.profile?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.member?.memberId.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const dateMatches = startDate && endDate
        ? new Date(item.createdAt) >= new Date(startDate) &&
          new Date(item.createdAt) <= new Date(endDate)
        : true;

      return searchMatches && dateMatches;
    }) || [];
  }, [redemptionHistory, searchQuery, startDate, endDate]);

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

  const resetFilters = () => {
    setSearchQuery('')
    setStartDate('')
    setEndDate('')
  }


  return (
    <div className="bg-white dark:bg-black rounded-lg p-4 mt-4">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Reward Redemption History</h2>

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
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-3 dark:text-gray-300">{item.member?.profile?.firstName} {item.member?.profile?.lastName}</td>
                    <td className="p-3 dark:text-gray-300">{item.member?.memberId}</td>
                    <td className="p-3 dark:text-gray-300">{item.reward?.pointReq}</td>
                    <td className="p-3 dark:text-gray-300">{item.reward?.rewardName}</td>
                    <td className="p-3 dark:text-gray-300">
                      {new Date(item.createdAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      }).replace(',', '/').replace(/\//g, '-').replace('-/', '/')}
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
    </div>
  );
};

export default RedemptionHistory;