'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/utils/format'
import { fetchCommissionHistory } from '@/utils/actions'
import ViewCommissionModal from './modals/ViewCommissionModal'

interface CommissionData {
  id: string
  type: string
  commissionRate: number
  name: string
  memberId: string | null
  commission: number
  dateTime: Date
}

export default function CommissionHistory() {
  const [commissionData, setCommissionData] = useState<CommissionData[]>([])
  const [filteredData, setFilteredData] = useState<CommissionData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedCommission, setSelectedCommission] = useState<CommissionData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        const data = await fetchCommissionHistory()
        setCommissionData(data)
        setFilteredData(data)
      } catch (error) {
        console.error('Error fetching commission data:', error)
      }
    }
    fetchCommissionData()
  }, [])

  useEffect(() => {
    let filtered = commissionData

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.memberId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((item) => item.type === typeFilter)
    }

    // Apply date range filter
    if (startDate || endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.dateTime)
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null

        return (!start || itemDate >= start) && (!end || itemDate <= end)
      })
    }

    setFilteredData(filtered)
  }, [searchTerm, typeFilter, commissionData, startDate, endDate])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, typeFilter, startDate, endDate])

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleViewDetails = (commission: CommissionData) => {
    setSelectedCommission(commission)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCommission(null)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setTypeFilter('all')
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="bg-white dark:bg-black p-4 sm:p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Commission History</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or ID"
          className="border dark:border-gray-700 dark:bg-black dark:text-white p-2 rounded flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border dark:border-gray-700 dark:bg-black dark:text-white p-2 rounded"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Commission Types</option>
          <option value="booking">Booking Commission</option>
          <option value="membership">Membership Commission</option>
          <option value="closer">Closer Commission</option>
        </select>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="date"
            className="border dark:border-gray-700 dark:bg-black dark:text-white p-2 rounded w-full sm:w-auto"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <span className="dark:text-white">to</span>
          <input
            type="date"
            className="border dark:border-gray-700 dark:bg-black dark:text-white p-2 rounded w-full sm:w-auto"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-4 px-4 dark:text-gray-300">Name</th>
                  <th className="pb-4 px-4 dark:text-gray-300">Member ID</th>
                  <th className="pb-4 px-4 dark:text-gray-300">Commission Rate</th>
                  <th className="pb-4 px-4 dark:text-gray-300">Commission Amount</th>
                  <th className="pb-4 px-4 dark:text-gray-300">Commission Category</th>
                  <th className="pb-4 px-4 dark:text-gray-300">Transaction Date/Time</th>
                  <th className="pb-4 px-4 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item.id} className="border-t dark:border-gray-800">
                      <td className="py-3 px-4 dark:text-gray-300">{item.name}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{item.memberId}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{item.commissionRate}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{formatCurrency(item.commission)}</td>
                      <td className="py-3 px-4 dark:text-gray-300">{item.type}</td>
                      <td className="py-3 px-4 dark:text-gray-300">
                        {new Date(item.dateTime).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        }).replace(/\//g, '-').replace(', ', '/')}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className="bg-[#B69C6C] text-white px-3 py-1 rounded hover:bg-[#A58B5B] whitespace-nowrap"
                          onClick={() => handleViewDetails(item)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-200 dark:bg-gray-900 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                : 'bg-[#B69C6C] text-white hover:bg-[#A58B5B]'
            }`}
          >
            Previous
          </button>

          <div className="flex flex-wrap gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded ${
                  currentPage === number
                    ? 'bg-[#B69C6C] text-white'
                    : 'bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {number}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 dark:bg-gray-900 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                : 'bg-[#B69C6C] text-white hover:bg-[#A58B5B]'
            }`}
          >
            Next
          </button>
        </div>
      )}

      <ViewCommissionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        commission={selectedCommission}
      />
    </div>
  )
}