'use client'

import { fetchMemberRequests } from "@/utils/actions";
import ViewNewMemberModal from "./modals/ViewNewMemberModal";
import { useEffect, useState } from "react";

type MemberRequest = {
  id: string,
  memberId: string,
  member: {
    profile: {
      firstName: string,
      lastName: string,
      email: string,
    },
    tier: {
      tierName: string,
    },
    dob: string | null,
    citizen: string | null,
    phone: string | null,
    address: string | null,
    gender: string | null,
    bankName: string | null,
    bankAccNum: string | null,
    bankAccName: string | null,
    isActive: number,
  },
  referalCode: string | null,
  closerId: string | null,
  paymentMethod: string,
  proofOfPayment: string | null,
  paymentStatus: boolean,
  createdAt: Date,
}

export function MemberRequests() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MemberRequest | null>(null)
  const [memberRequests, setMemberRequests] = useState<MemberRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const itemsPerPage = 10;

  // Filter and search logic
  const filteredRequests = memberRequests.filter(request => {
    const matchesSearch = searchTerm === '' ||
      request.member.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.member.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.memberId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPaymentStatus =
      paymentStatusFilter === 'all' ||
      (paymentStatusFilter === 'completed' && request.paymentStatus) ||
      (paymentStatusFilter === 'pending' && !request.paymentStatus);

    return matchesSearch && matchesPaymentStatus;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, paymentStatusFilter]);

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRequest(null)
  }

  const handleViewClick = (memberId: string) => {
    setSelectedRequest(memberRequests.find(request => request.memberId === memberId) || null)
    setIsModalOpen(true)
  }

  useEffect(() => {
    const getMemberRequests = async () => {
      const data = await fetchMemberRequests();
      console.log('Member requests:', data);
      setMemberRequests(data as MemberRequest[]);
    };
    getMemberRequests();
  }, []);

  return (
    <div className="bg-white dark:bg-black rounded-lg shadow">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or member ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value as 'all' | 'completed' | 'pending')}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="all">All Payment Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredRequests.length} results
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-900 dark:text-gray-100">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-black">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Referral ID</th>
              <th className="px-6 py-3">Closer ID</th>
              <th className="px-6 py-3">Payment Method</th>
              <th className="px-6 py-3">Payment Status</th>
              <th className="px-6 py-3">Registration Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((request) => (
              <tr key={request.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div>
                    <div className="font-medium">
                      {request.member?.profile.firstName} {request.member?.profile.lastName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {request.memberId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{request.referalCode}</td>
                <td className="px-6 py-4">{request.closerId}</td>
                <td className="px-6 py-4">{request.paymentMethod}</td>
                <td className="px-6 py-4">
                  {request.paymentStatus ? 'Completed' : 'Pending'}
                </td>
                <td className="px-6 py-4">{request.createdAt.toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleViewClick(request.memberId)} className="text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded-md px-2 py-1 hover:text-green-900 dark:hover:text-green-300 mr-3">
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {memberRequests.length === 0 ? 'No pending member requests' : 'No results found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls - removed the memberRequests.length > 0 condition */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
          disabled={currentPage === 1 || memberRequests.length === 0}
          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>
        <button
          onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages || memberRequests.length === 0}
          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <ViewNewMemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        memberData={selectedRequest}
      />
    </div>
  );
}