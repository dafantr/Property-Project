'use client'

import ViewNewMemberModal from "./modals/ViewNewMemberModal";
import ApprovalConfirmationModal from "./modals/ApprovalConfirmationModal";
import { useState, useEffect } from "react";
import { EyeIcon, CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { approveMemberRequestAction, fetchMemberRequests, rejectMemberRequestAction } from "@/utils/actions";

export type MemberRequest = {
  id: string;
  referalCode: string | null;
  closerId: string | null;
  paymentMethod: string;
  paymentStatus: boolean;
  member: {
    memberId: string;
    createdAt: Date;
    isActive: number;
    profile: {
      firstName: string;
      lastName: string;
      clerkId: string;
    }
  } | null
}

interface MemberRequestsProps {
  selectedPeriod: string;
}

export function MemberRequests({ selectedPeriod }: MemberRequestsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MemberRequest | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentFilter, setPaymentFilter] = useState<"all" | "completed" | "pending">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [memberRequests, setMemberRequests] = useState<MemberRequest[]>([])

  useEffect(() => {
    const getMemberRequests = async () => {
      let startDate = null;
      let endDate = new Date();

      if (selectedPeriod === 'today') {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
      } else if (selectedPeriod === 'week') {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
      } else if (selectedPeriod === 'month') {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
      }

      const data = await fetchMemberRequests(startDate, endDate);
      setMemberRequests(data.map(item => ({
        ...item,
        member: item.member ? {
          memberId: item.member.memberId,
          createdAt: item.member.createdAt,
          isActive: item.member.isActive,
          profile: {
            firstName: item.member.profile.firstName,
            lastName: item.member.profile.lastName,
            clerkId: item.member.profile.clerkId
          }
        } : null
      })));
    };

    getMemberRequests();
  }, [selectedPeriod]);

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRequest(null)
  }

  const handleApprovalClick = (request: MemberRequest) => {
    setSelectedRequest(request);
    setIsApprovalModalOpen(true);
  };

  const handleApprovalConfirm = async () => {
    if (!selectedRequest) return;

    try {
      if (!selectedRequest?.member) return;
      const result = await approveMemberRequestAction(selectedRequest.member.memberId);
      if (result.message) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error approving member:', error);
    } finally {
      setIsApprovalModalOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleRejectClick = (request: MemberRequest) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRequest) return;

    try {
      if (!selectedRequest?.member) return;
      const result = await rejectMemberRequestAction(selectedRequest.member.memberId);
      if (result.message) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error rejecting member:', error);
    } finally {
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
    }
  };

  // Filter and search logic
  const filteredRequests = memberRequests.filter(request => {
    const matchesSearch =
      request.member?.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.member?.profile?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.member?.memberId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPaymentFilter =
      paymentFilter === "all" ? true :
      paymentFilter === "completed" ? request.paymentStatus :
      !request.paymentStatus;

    return matchesSearch && matchesPaymentFilter;
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Add this console log to debug
  console.log({
    totalItems: filteredRequests.length,
    itemsPerPage,
    totalPages,
    currentPage,
    paginatedLength: paginatedRequests.length
  })

  return (
    <div className="bg-white dark:bg-black rounded-lg shadow space-y-4">
      <div className="p-4 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or member ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as "all" | "completed" | "pending")}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black dark:text-white"
        >
          <option value="all">All Payments</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        {/* Clear button - updated to match MemberList style */}
        <button
          onClick={() => {
            setSearchTerm("");
            setPaymentFilter("all");
          }}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Clear Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-[900px] md:w-full text-sm text-left dark:text-gray-200">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-black">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Referral ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Closer ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Payment Method</th>
              <th className="px-4 py-3 whitespace-nowrap">Payment Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Registration Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.map((request) => (
              <tr key={request.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium dark:text-white">
                      {request.member?.profile?.firstName || 'N/A'} {request.member?.profile?.lastName || ''}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {request.member?.memberId}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{request.referalCode || 'N/A'}</td>
                <td className="px-4 py-4 whitespace-nowrap">{request.closerId || 'N/A'}</td>
                <td className="px-4 py-4 whitespace-nowrap">{request.paymentMethod}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {request.paymentStatus ? 'Completed' : 'Pending'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {request.member?.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleApprovalClick(request)}
                      className="p-1.5 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="Approve"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRejectClick(request)}
                      className="p-1.5 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Reject"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedRequests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No matching member requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800 gap-4">
        <p className="text-sm text-gray-700 dark:text-gray-200 text-center sm:text-left">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of{' '}
          {filteredRequests.length} results
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <ViewNewMemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        request={selectedRequest}
      />

      <ApprovalConfirmationModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleApprovalConfirm}
        memberId={selectedRequest?.member?.memberId || ''}
      />

      <ApprovalConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        memberId={selectedRequest?.member?.memberId || ''}
        mode="reject"
      />
    </div>
  );
}