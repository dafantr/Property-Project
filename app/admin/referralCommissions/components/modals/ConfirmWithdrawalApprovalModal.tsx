
import SuccessModal from "@/components/ui/SuccessModal";
import { updateWithdrawalStatus } from "@/utils/actions";
import { fetchAdminWithdrawalRequests } from "@/utils/actions";
import { ConfirmWithdrawalApprovalModalProps, WithdrawalRequestDetails } from "@/utils/types";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConfirmWithdrawalApprovalModal(
    {
        request,
        setConfirmWithdrawalApprovalModal,
        handleCloseWithdrawalModal,
        handleApprove
    }: ConfirmWithdrawalApprovalModalProps
) {
    const onBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
		  setConfirmWithdrawalApprovalModal(false);
		}
	};

    return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onBackdropClick}>
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
				<h3 className="text-lg font-semibold mb-4 dark:text-white">
				Confirm Redemption
				</h3>
				<p className="text-gray-600 dark:text-gray-300 mb-6">
				Are you sure you want to approve this withdrawal request? 
				</p>
				<div className="flex justify-end gap-3">
				<button
					onClick={handleCloseWithdrawalModal}
					className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
				>
					Cancel
				</button>
				<button
					onClick={() => handleApprove(request?.id || '', request?.amount || 0)}
					className="bg-[#C4A777] text-white px-4 py-2 rounded text-sm hover:bg-[#B39665] transition-colors"
				>
					Confirm Approval
				</button>
				</div>
			</div>
		</div>
    )
}