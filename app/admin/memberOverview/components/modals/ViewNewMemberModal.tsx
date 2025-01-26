'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MemberRequest } from '../MemberRequests';  // Import the shared type

interface ViewNewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: MemberRequest | null;
}

export default function ViewNewMemberModal({ isOpen, onClose, request }: ViewNewMemberModalProps) {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">
            Member Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
              <p className="text-gray-900 dark:text-white">
                {request.member?.profile?.firstName} {request.member?.profile?.lastName}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Member ID</label>
              <p className="text-gray-900 dark:text-white">{request.member?.memberId || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Referral Code</label>
              <p className="text-gray-900 dark:text-white">{request.referalCode || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Closer ID</label>
              <p className="text-gray-900 dark:text-white">{request.closerId || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</label>
              <p className="text-gray-900 dark:text-white">{request.paymentMethod}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</label>
              <p className={`font-medium ${
                request.paymentStatus
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {request.paymentStatus ? 'Completed' : 'Pending'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Date</label>
              <p className="text-gray-900 dark:text-white">
                {request.member?.createdAt.toLocaleDateString() || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}