'use client'

import { useState, useEffect } from 'react'
import { fetchAdminWithdrawalRequests, updateWithdrawalStatus } from '@/utils/actions'
import ViewWithdrawalModal from './modals/ViewWithdrawalModal'
import { formatCurrency } from '@/utils/format'

interface WithdrawalRequest {
  name: string
  memberId: string
  amount: string
  status: string
  bank: string
  requestDate: string
  id: string
}

export default function WithdrawalRequest() {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [message, setMessage] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [bankFilter, setBankFilter] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadWithdrawalRequests = async () => {
      try {
        const data = await fetchAdminWithdrawalRequests()
        setWithdrawalRequests(data)
      } catch (error) {
        console.error('Error loading withdrawal requests:', error)
      }
    }

    loadWithdrawalRequests()
  }, [])

  const uniqueBanks = Array.from(new Set(withdrawalRequests.map(request => request.bank)))
  const uniqueStatuses = Array.from(new Set(withdrawalRequests.map(request => request.status)))

  const filteredRequests = withdrawalRequests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.memberId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter ? request.status === statusFilter : true
    const matchesBank = bankFilter ? request.bank === bankFilter : true

    // Parse the request date properly
    const [datePart] = request.requestDate.split(' ') // Split date and time
    const [day, month, year] = datePart.split('-')
    const requestDate = new Date(+year, +month - 1, +day)

    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null

    const matchesDate =
      (!start || requestDate >= start) &&
      (!end || requestDate <= end)

    return matchesSearch && matchesStatus && matchesBank && matchesDate
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, bankFilter, startDate, endDate])

  const handleApprove = async (id: string) => {
    try {
      const result = await updateWithdrawalStatus(id, 'Approved')
      if (result.status === 'success') {
        // Refresh the list after successful update
        const data = await fetchAdminWithdrawalRequests()
        setWithdrawalRequests(data)
        setMessage('Request approved successfully')
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      console.error('Error approving request:', error)
      setMessage('Failed to approve request')
    }
  }

  const handleReject = async (id: string) => {
    try {
      const result = await updateWithdrawalStatus(id, 'Rejected')
      if (result.status === 'success') {
        // Refresh the list after successful update
        const data = await fetchAdminWithdrawalRequests()
        setWithdrawalRequests(data)
        setMessage('Request rejected successfully')
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      setMessage('Failed to reject request')
    }
  }

  const handleView = (request: WithdrawalRequest) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRequest(null)
  }

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setBankFilter('')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
  }

  return (
    <div className="bg-white dark:bg-black p-2 sm:p-6 rounded-lg">
      {message && (
        <div className="mb-4 p-2 bg-blue-100 dark:bg-black text-blue-700 dark:text-white rounded border dark:border-gray-700">
          {message}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4 dark:text-white">Commission Withdrawal Request</h2>

      <div className="grid grid-cols-1 sm:flex sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or ID"
          className="border p-2 rounded w-full dark:bg-black dark:border-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded w-full dark:bg-black dark:border-gray-700 dark:text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Filter by Status</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded w-full dark:bg-black dark:border-gray-700 dark:text-white"
          value={bankFilter}
          onChange={(e) => setBankFilter(e.target.value)}
        >
          <option value="">Filter by Bank</option>
          {uniqueBanks.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
        <div className="grid grid-cols-1 sm:flex sm:flex-row items-center gap-2">
          <input
            type="date"
            className="border p-2 rounded w-full dark:bg-black dark:border-gray-700 dark:text-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <span className="text-center dark:text-white">to</span>
          <input
            type="date"
            className="border p-2 rounded w-full dark:bg-black dark:border-gray-700 dark:text-white"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
        <button
          onClick={resetFilters}
          className="bg-[#B69C6C] text-white p-2 rounded hover:bg-[#A58B5B] w-full"
        >
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-black">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold dark:text-white">Name</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold dark:text-white">Member ID</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold dark:text-white">Amount</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold dark:text-white">Status</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold dark:text-white">Bank</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold dark:text-white">Date</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentItems.length > 0 ? (
                  currentItems.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm dark:text-white whitespace-nowrap">{request.name}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm dark:text-white whitespace-nowrap">{request.memberId}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm dark:text-white whitespace-nowrap">{formatCurrency(Number(request.amount))}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm dark:text-white whitespace-nowrap">{request.status}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm dark:text-white whitespace-nowrap">{request.bank}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm dark:text-white whitespace-nowrap">{request.requestDate}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <button
                            className="bg-[#B69C6C] text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded hover:bg-[#A58B5B]"
                            onClick={() => handleView(request)}
                          >
                            View
                          </button>
                          {request.status !== 'Approved' && (
                            <button
                              className="bg-[#B69C6C] text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded hover:bg-[#A58B5B]"
                              onClick={() => handleApprove(request.id)}
                            >
                              Approve
                            </button>
                          )}
                          {request.status !== 'Rejected' && (
                            <button
                              className="bg-[#B69C6C] text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded hover:bg-[#A58B5B]"
                              onClick={() => handleReject(request.id)}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-2 sm:px-4 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredRequests.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4 px-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
              currentPage === 1
                ? 'bg-gray-200 dark:bg-gray-900 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                : 'bg-[#B69C6C] text-white hover:bg-[#A58B5B]'
            }`}
          >
            Previous
          </button>

          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
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
            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 dark:bg-gray-900 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                : 'bg-[#B69C6C] text-white hover:bg-[#A58B5B]'
            }`}
          >
            Next
          </button>
        </div>
      )}

      <ViewWithdrawalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
      />
    </div>
  )
}