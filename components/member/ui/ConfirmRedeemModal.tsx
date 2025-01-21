import { redeemReward } from "@/utils/actions";
import { reward } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SuccessModal from "./SuccessModal";

export default function ConfirmModal({ 
    selectedReward,
    setShowConfirmModal,
    setShowSuccessModal
}: { selectedReward: reward | null, setShowConfirmModal: (show: boolean) => void, setShowSuccessModal: (show: boolean) => void }) {

    const router = useRouter();
    
    const onConfirmRedeem = () => {
		if (selectedReward) {
		  handleRedeem(selectedReward);
		}
		setShowConfirmModal(false);
        setShowSuccessModal(true);

        setTimeout(() => {
            setShowSuccessModal(false);
            router.refresh();
        }, 2000);
	};
  
    const handleRedeem = async (reward : reward) => {
		try {
			await redeemReward(reward);
		} catch (error) {
			throw new Error("Failed to redeem reward.");
		}
	}

    const onBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
		  setShowConfirmModal(false);
		}
	};

	return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onBackdropClick}>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Confirm Redemption
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to redeem {selectedReward?.rewardName}? 
                This will use {selectedReward?.pointReq} points.
                </p>
                <div className="flex justify-end gap-3">
                <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirmRedeem}
                    className="bg-[#C4A777] text-white px-4 py-2 rounded text-sm hover:bg-[#B39665] transition-colors"
                >
                    Confirm Redeem
                </button>
                </div>
            </div>
        </div>
	);
}