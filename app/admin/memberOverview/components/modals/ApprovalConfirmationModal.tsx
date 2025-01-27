'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ApprovalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberId: string;
  mode?: 'approve' | 'reject';
}

export default function ApprovalConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  memberId,
  mode = 'approve'
}: ApprovalConfirmationModalProps) {
  const isReject = mode === 'reject';
  const title = isReject ? 'Reject Member Request' : 'Approve Member Request';
  const message = isReject
    ? `Are you sure you want to reject the member request for ${memberId}?`
    : `Are you sure you want to approve the member request for ${memberId}?`;
  const confirmButtonText = isReject ? 'Reject' : 'Approve';
  const confirmButtonClass = isReject
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            {message}
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={confirmButtonClass}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}