'use client'

type MemberRequest = {
  id: string;
  memberId: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
    createdAt: Date;
  };
  tier: {
    tierName: string;
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
              <th className="px-6 py-3">Member</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Join Date</th>
              <th className="px-6 py-3">Tier</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {memberRequests.map((request) => (
              <tr key={request.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={request.profile.profileImage}
                    alt={request.profile.firstName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">
                      {request.profile.firstName} {request.profile.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {request.memberId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{request.profile.email}</td>
                <td className="px-6 py-4">
                  {new Date(request.profile.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{request.tier.tierName}</td>
                <td className="px-6 py-4">
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    Approve
                  </button>
                  <button className="text-red-600 hover:text-red-900">
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