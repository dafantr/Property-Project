import { formatCurrency } from '@/utils/format'

interface ViewWithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  request: {
    name: string
    memberId: string
    email: string
    phone: string
    amount: string
    netAmount: string
    status: string
    bank: string
    accountNumber: string
    accountName: string
    requestDate: string
    notes: string
  } | null
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

        <div className="grid grid-cols-2 gap-8">
          {/* Member Details Column */}
          <div className="p-4 rounded-lg bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Member Details</h3>
            <div className="space-y-4">
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Name</label>
                <p className="dark:text-white">{request.name}</p>
              </div>
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Member ID</label>
                <p className="dark:text-white">{request.memberId}</p>
              </div>
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Email</label>
                <p className="dark:text-white">{request.email}</p>
              </div>
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Phone</label>
                <p className="dark:text-white">{request.phone}</p>
              </div>
            </div>

            <h3 className="text-lg font-bold mt-6 mb-4 dark:text-white">Bank Account Details</h3>
            <div className="space-y-4">
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Bank</label>
                <p className="dark:text-white">{request.bank}</p>
              </div>
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Account Number</label>
                <p className="dark:text-white">{request.accountNumber}</p>
              </div>
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Account Holder</label>
                <p className="dark:text-white">{request.accountName}</p>
              </div>
            </div>
          </div>

          {/* Withdrawal Details Column */}
          <div className="p-4 rounded-lg bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Withdrawal Details</h3>
            <div className="space-y-4">
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Requested Amount</label>
                <p className="dark:text-white">{formatCurrency(Number(request.amount))}</p>
              </div>
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Net Amount</label>
                <p className="dark:text-white">{formatCurrency(Number(request.netAmount))}</p>
              </div>
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Date Submitted</label>
                <p className="dark:text-white">{request.requestDate}</p>
              </div>
              <div>
                <label className="font-semibold block text-gray-700 dark:text-gray-300">Notes</label>
                <p className="dark:text-white">{request.notes}</p>
              </div>
            </div>
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