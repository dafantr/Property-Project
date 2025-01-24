'use client'

import { member, membershipCommissionTransaction } from "@/utils/types";

type MemberRequest = {
  member: {
    profileId: string;
    memberId: string;
    createdAt: Date;
  };
  id: string;
  referalCode: string | null;
  closerId: string | null;
  paymentMethod: string;
  paymentStatus: boolean;
  profile: {
      clerkId: string;
      firstName: string;
      lastName: string;
  };
}

interface MemberRequestsProps {
  memberRequests: MemberRequest[];
}

export function MemberRequests({ memberRequests }: MemberRequestsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50">
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
            {memberRequests.map((request) => (
              <tr key={request.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div>
                    <div className="font-medium">
                      {request.profile.firstName} {request.profile.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.member.memberId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{request.referalCode}</td>
                <td className="px-6 py-4">{request.closerId}</td>
                <td className="px-6 py-4">{request.paymentMethod}</td>
                <td className="px-6 py-4">
                  {request.paymentStatus ? 'Completed' : 'Pending'}
                </td>
                <td className="px-6 py-4">{request.member?.createdAt.toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button className="text-green-600 border border-green-600 rounded-md px-2 py-1 hover:text-green-900 mr-3">
                    View
                  </button>
                  <button className="text-green-600 border border-green-600 rounded-md px-2 py-1 hover:text-green-900 mr-3">
                    Approve
                  </button>
                  <button className="text-red-600 border border-red-600 rounded-md px-2 py-1 hover:text-red-900">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {memberRequests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No pending member requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}