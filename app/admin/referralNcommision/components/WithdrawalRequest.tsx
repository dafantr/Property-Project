'use client'

import { useState, useEffect } from 'react'
import { fetchAdminWithdrawalRequests, updateWithdrawalStatus } from '@/utils/actions'
import ViewWithdrawalModal from './modals/ViewWithdrawalModal'

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
    <div className="bg-white dark:bg-black p-4 sm:p-6 rounded-lg">
      {message && (
        <div className="mb-4 p-2 bg-blue-100 dark:bg-black text-blue-700 dark:text-white rounded">
          {message}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4 dark:text-white">Commission Withdrawal Request</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or ID"
          className="border p-2 rounded flex-1 dark:bg-black dark:border-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded dark:bg-black dark:border-gray-700 dark:text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Filter by Status</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          className="border p-2 rounded dark:bg-black dark:border-gray-700 dark:text-white"
          value={bankFilter}
          onChange={(e) => setBankFilter(e.target.value)}
        >
          <option value="">Filter by Bank</option>
          {uniqueBanks.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="border p-2 rounded dark:bg-black dark:border-gray-700 dark:text-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <span className="dark:text-white">to</span>
          <input
            type="date"
            className="border p-2 rounded dark:bg-black dark:border-gray-700 dark:text-white"
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
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="text-left bg-gray-50 dark:bg-black">
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-sm font-semibold dark:text-white">Name</th>
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-sm font-semibold dark:text-white">Member ID</th>
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-sm font-semibold dark:text-white">Amount</th>
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-sm font-semibold dark:text-white">Status</th>
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-sm font-semibold dark:text-white">Bank</th>
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-sm font-semibold dark:text-white">Date</th>
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-sm font-semibold dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="border border-gray-200 dark:border-gray-700 p-3 dark:text-white">{request.name}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-3 dark:text-white">{request.memberId}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-3 dark:text-white">{request.amount}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-3 dark:text-white">{request.status}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-3 dark:text-white">{request.bank}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-3 dark:text-white">{request.requestDate}</td>
                  <td className="border border-gray-200 dark:border-gray-700 p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="bg-[#B69C6C] text-white px-3 py-1 rounded hover:bg-[#A58B5B]"
                        onClick={() => handleView(request)}
                      >
                        View
                      </button>
                      {request.status !== 'Approved' && (
                        <button
                          className="bg-[#B69C6C] text-white px-3 py-1 rounded hover:bg-[#A58B5B]"
                          onClick={() => handleApprove(request.id)}
                        >
                          Approve
                        </button>
                      )}
                      {request.status !== 'Rejected' && (
                        <button
                          className="bg-[#B69C6C] text-white px-3 py-1 rounded hover:bg-[#A58B5B]"
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
                <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredRequests.length > 0 && (
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

      <ViewWithdrawalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
      />
    </div>
  )
}