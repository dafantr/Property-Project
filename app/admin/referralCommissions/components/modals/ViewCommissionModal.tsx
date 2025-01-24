import { formatCurrency } from '@/utils/format'

interface CommissionData {
  id: string
  type: 'Booking' | 'Membership' | 'Closer'
  memberName: string
  memberId: string | null
  amount: number
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Commission Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">Name</p>
            <p>{commission.memberName}</p>
          </div>
          <div>
            <p className="font-semibold">Member ID</p>
            <p>{commission.memberId || '-'}</p>
          </div>
          <div>
            <p className="font-semibold">Commission Amount</p>
            <p>{formatCurrency(commission.amount)}</p>
          </div>
          <div>
            <p className="font-semibold">Commission Category</p>
            <p>{commission.type}</p>
          </div>
          <div>
            <p className="font-semibold">Transaction Date/Time</p>
            <p>{new Date(commission.dateTime).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            }).replace(/\//g, '-').replace(', ', '/')}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#B69C6C] text-white px-4 py-2 rounded hover:bg-[#A58B5B]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}