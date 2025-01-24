'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/utils/format'
import { fetchCommissionHistory } from '@/utils/actions'
import ViewCommissionModal from './modals/ViewCommissionModal'

interface CommissionData {
  id: string
  type: 'Booking' | 'Membership' | 'Closer'
  memberName: string
  memberId: string | null
  amount: number
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
          item.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Commission History</h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or ID"
          className="border p-2 rounded flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Commission Types</option>
          <option value="Booking">Booking Commission</option>
          <option value="Membership">Membership Commission</option>
          <option value="Closer">Closer Commission</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <span>to</span>
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
        <button
          onClick={resetFilters}
          className="bg-[#B69C6C] text-white px-4 py-2 rounded hover:bg-[#A58B5B]"
        >
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-4">Name</th>
              <th className="pb-4">Member ID</th>
              <th className="pb-4">Commission Rate</th>
              <th className="pb-4">Commission Amount</th>
              <th className="pb-4">Commission Category</th>
              <th className="pb-4">Transaction Date/Time</th>
              <th className="pb-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-3">{item.memberName}</td>
                  <td className="py-3">{item.memberId}</td>
                  <td className="py-3">-</td>
                  <td className="py-3">{formatCurrency(item.amount)}</td>
                  <td className="py-3">{item.type}</td>
                  <td className="py-3">
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
                  <td className="py-3">
                    <button
                      className="bg-[#B69C6C] text-white px-3 py-1 rounded hover:bg-[#A58B5B]"
                      onClick={() => handleViewDetails(item)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#B69C6C] text-white hover:bg-[#A58B5B]'
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded ${
                  currentPage === number
                    ? 'bg-[#B69C6C] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
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