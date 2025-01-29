import { WithdrawalRequestDetails } from "@/utils/types"

interface ViewWithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  request : WithdrawalRequestDetails | null
}

export default function ViewWithdrawalModal({ isOpen, onClose, request }: ViewWithdrawalModalProps) {
  if (!isOpen || !request) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black p-6 rounded-lg w-full max-w-[800px] max-h-[80vh] overflow-y-auto border border-gray-200/80 dark:border-gray-700/80 shadow-lg ring-1 ring-gray-100 dark:ring-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Request ID: #{request.memberId}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-semibold block text-gray-700 dark:text-gray-300">Member Name</label>
            <p className="dark:text-white">{request.member?.profile.firstName} {request.member?.profile.lastName}</p>
          </div>

          <div>
            <label className="font-semibold block text-gray-700 dark:text-gray-300">Member ID</label>
            <p className="dark:text-white">{request.memberId}</p>
          </div>

          <div>
            <label className="font-semibold block text-gray-700 dark:text-gray-300">Amount</label>
            <p className="dark:text-white">{request.amount}</p>
          </div>

          <div>
            <label className="font-semibold block text-gray-700 dark:text-gray-300">Status</label>
            <p className="dark:text-white">{request.status}</p>
          </div>

          <div>
            <label className="font-semibold block text-gray-700 dark:text-gray-300">Bank</label>
            <p className="dark:text-white">{request.bankName}</p>
          </div>

          <div>
            <label className="font-semibold block text-gray-700 dark:text-gray-300">Request Date</label>
            <p className="dark:text-white">{request.createdAt.toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}