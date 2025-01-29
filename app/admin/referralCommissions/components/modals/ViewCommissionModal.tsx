import { formatCurrency } from '@/utils/format'

interface CommissionData {
  id: string
  type: string
  name: string
  memberId: string | null
  commission: number
  dateTime: Date
}

interface ViewCommissionModalProps {
  isOpen: boolean
  onClose: () => void
  commission: CommissionData | null
}

export default function ViewCommissionModal({ isOpen, onClose, commission }: ViewCommissionModalProps) {
  if (!isOpen || !commission) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full border border-gray-200 dark:border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold dark:text-white">Commission Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Name</p>
            <p className="dark:text-white">{commission.name}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Member ID</p>
            <p className="dark:text-white">{commission.memberId || '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Commission Amount</p>
            <p className="dark:text-white">{formatCurrency(commission.commission)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Commission Category</p>
            <p className="dark:text-white">{commission.type}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Transaction Date/Time</p>
            <p className="dark:text-white">
              {new Date(commission.dateTime).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              }).replace(/\//g, '-').replace(', ', '/')}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#B69C6C] text-white px-4 py-2 rounded hover:bg-[#A58B5B] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}