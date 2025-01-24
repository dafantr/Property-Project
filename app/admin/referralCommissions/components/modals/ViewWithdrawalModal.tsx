interface ViewWithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  request: {
    name: string
    memberId: string
    amount: string
    status: string
    bank: string
    requestDate: string
  } | null
}

export default function ViewWithdrawalModal({ isOpen, onClose, request }: ViewWithdrawalModalProps) {
  if (!isOpen || !request) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black p-6 rounded-lg w-full max-w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Withdrawal Request Details</h2>
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
            <p className="dark:text-white">{request.name}</p>
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
            <p className="dark:text-white">{request.bank}</p>
          </div>

          <div>
            <label className="font-semibold block text-gray-700 dark:text-gray-300">Request Date</label>
            <p className="dark:text-white">{request.requestDate}</p>
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