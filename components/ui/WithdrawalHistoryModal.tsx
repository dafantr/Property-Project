import { useState } from "react";
import SuccessModal from "@/components/ui/SuccessModal";
import ConfirmWithdrawModal from "@/components/ui/ConfirmWithdrawModal";
import { WithdrawalHistoryModalProps } from "@/utils/types";
import { formatCurrency } from "@/utils/format";
import ErrorModal from "@/components/ui/ErrorModal";

export default function WithdrawalHistoryModal({
    setShowWithdrawalHistoryModal,
    member,
    withdrawalRequestDetails,
} : WithdrawalHistoryModalProps) {

    const [showConfirmModal, setShowWithdrawModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const onBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
		  setShowWithdrawalHistoryModal(false);
		}
	};

    const [statusFilter, setStatusFilter] = useState('all');

	const filteredWithdrawalRequestDetails = withdrawalRequestDetails.filter(detail => 
	    statusFilter === 'all' || 
	    (statusFilter === 'approved' && detail.status === 'Approved') ||
	    (statusFilter === 'pending' && detail.status === 'Pending') ||
        (statusFilter === 'rejected' && detail.status === 'Rejected')
	);

    const onRequestWithdrawClick = () => {
		setShowWithdrawModal(true);
	  };
    
	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onBackdropClick}>
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-zinc-800 z-10 pb-4">
                    <h3 className="text-2xl font-bold mb-8 dark:text-white">
                        Withdrawal History
                    </h3>
                </div>

                <div className="overflow-x-auto -mx-4 md:mx-0">
                    <table className="w-full hidden md:table">
                        <thead className="border-b border-gray-200 dark:border-zinc-700">
                            <tr className="dark:text-gray-200">
                                <th className="text-left py-2 px-4">Name</th>
                                <th className="text-left py-2 px-4">Member ID</th>
                                <th className="text-left py-2 px-4">Amount</th>
                                <th className="text-left py-2 px-4">Status : 
                                    <select
                                        className="py-1.5 text-sm rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                        <option value="all">All</option>
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </th>
                                <th className="text-left py-2 px-4">Bank Destination</th>
                                <th className="text-left py-2 px-4">Requested Date</th>
                            </tr>
                        </thead>
                        <tbody className="dark:text-gray-300">
                            {filteredWithdrawalRequestDetails.map((withdrawalRequestDetail) => (
                                <tr key={withdrawalRequestDetail.id} className="border-b border-gray-100 dark:border-zinc-800">
                                    <td className="py-2 px-4">{withdrawalRequestDetail.member?.profile.firstName} {withdrawalRequestDetail.member?.profile.lastName}</td>
                                    <td className="py-2 px-4">{member.memberId}</td>
                                    <td className="py-2 px-4">{formatCurrency(withdrawalRequestDetail.amount)}</td>
                                    <td className="py-2 px-4">
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            withdrawalRequestDetail.status === 'Approved'
                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                            : withdrawalRequestDetail.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                            {withdrawalRequestDetail.status}
                                        </span>
                                    </td>
                                    <td>{withdrawalRequestDetail.bankAccName}</td>
                                    <td>{withdrawalRequestDetail.createdAt.toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="md:hidden space-y-4 mb-4">
                        <select
                            className="px-3 py-1.5 text-sm border rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            >
                            <option value="all">Status : All</option>
                            <option value="approved">Status : Approved</option>
                            <option value="pending">Status : Pending</option>
                            <option value="rejected">Status : Rejected</option>
                        </select>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {filteredWithdrawalRequestDetails.map((withdrawalRequestDetail) => (
                            <div 
                                key={withdrawalRequestDetail.id} 
                                className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700"
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Name</span>
                                        <span>{withdrawalRequestDetail.member?.profile.firstName} {withdrawalRequestDetail.member?.profile.lastName}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Member ID</span>
                                        <span>{member.memberId}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Amount</span>
                                        <span>{formatCurrency(withdrawalRequestDetail.amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Status</span>
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            withdrawalRequestDetail.status === 'Approved'
                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                            : withdrawalRequestDetail.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                            {withdrawalRequestDetail.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Bank Destination</span>
                                        <span>{withdrawalRequestDetail.bankName}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Requested Date</span>
                                        <span>{withdrawalRequestDetail.createdAt.toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sticky bottom-0 bg-white dark:bg-zinc-800 pt-4 mt-4 border-t border-gray-200 dark:border-zinc-700">
                    <button 
                        className="w-full md:w-auto px-4 py-2 bg-[#C4A777] hover:bg-[#B39665] text-white text-sm rounded transition-colors"
                        onClick={onRequestWithdrawClick}
                        >
                        Withdraw
                    </button>
                </div>
            </div>
            
            {showConfirmModal && (
                <ConfirmWithdrawModal member={member} setShowWithdrawModal={setShowWithdrawModal} setShowSuccessModal={setShowSuccessModal} setShowErrorModal={setShowErrorModal} />
            )}
            {showSuccessModal && (
                <SuccessModal message="Withdrawal request created successfully" />
            )}

            {showErrorModal && (
                <ErrorModal message="Failed to create withdrawal request" />
            )}

		</div>
	);
}