"use client"
import { redeemReward } from "@/utils/actions";
import { LoyaltiPointsProps, reward } from "@/utils/types";
import { useState } from "react";
import ConfirmRedeemModal from "./ui/ConfirmRedeemModal";
import SuccessModal from "./ui/SuccessModal";

export default function LoyaltiPoints({
	member,
	rewards,
	loyaltyPointDetails,
}: LoyaltiPointsProps) {

	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [selectedReward, setSelectedReward] = useState<reward | null>(null);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const onRedeemClick = (reward: reward) => {
		setSelectedReward(reward);
		setShowConfirmModal(true);
	  };

	return (
		<div className="grid grid-cols-1 gap-4 md:gap-6">
			{/* Referral & Commission Card */}
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h1 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Total Points : {member.point || 0}</h1>
			</div>
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
			<h3 className="font-semibold mb-2 dark:text-white">Points History</h3>
				<div className="overflow-x-auto hidden md:block">
					<table className="w-full">
						<thead className="border-b border-gray-200 dark:border-zinc-700">
							<tr className="dark:text-gray-200">
								<th className="text-left py-2 px-4">Date</th>
								<th className="text-left py-2 px-4">Activity Description</th>
								<th className="text-left py-2 px-4">Points Earned</th>
							</tr>
						</thead>
						<tbody className="dark:text-gray-300">
							{loyaltyPointDetails.length > 0 ? (
								loyaltyPointDetails.map((loyaltyPointDetail) => (
									<tr key={loyaltyPointDetail.id} className="border-b border-gray-100 dark:border-zinc-800">
									<td className="py-2 px-4">{loyaltyPointDetail.createdAt.toLocaleDateString()}</td>
									<td className="py-2 px-4">{loyaltyPointDetail.type}</td>
									<td className="py-2 px-4">
									{loyaltyPointDetail.type.includes('Redeem Reward') ? (
										<span className="py-2 px-1 rounded text-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
											{loyaltyPointDetail.point}
										</span>
									) : (
										<span className="px-2 py-1 rounded text-sm bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
											{loyaltyPointDetail.point}
										</span>
									)}
									</td>
								</tr>
								))
							) : (
								<tr>
									<td className="py-2 px-4 text-gray-500 dark:text-gray-400">No Data</td>
									<td className="py-2 px-4 text-gray-500 dark:text-gray-400">No Data</td>
									<td className="py-2 px-4 text-gray-500 dark:text-gray-400">No Data</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Mobile Card View */}
				<div className="md:hidden space-y-4">
					{loyaltyPointDetails.map((loyaltyPointDetail) => (
					<div 
						key={loyaltyPointDetail.id} 
						className="border border-gray-100 dark:border-zinc-800 rounded-lg p-4"
					>
						<div className="flex justify-between items-start mb-2">
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{loyaltyPointDetail.createdAt.toLocaleDateString()}
						</span>
						{loyaltyPointDetail.type.includes('Redeem Reward') ? (
							<span className="px-2 py-1 rounded text-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
							{loyaltyPointDetail.point}
							</span>
						) : (
							<span className="px-2 py-1 rounded text-sm bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
							{loyaltyPointDetail.point}
							</span>
						)}
						</div>
						<div className="text-sm dark:text-gray-300">
						{loyaltyPointDetail.type}
						</div>
					</div>
					))}
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4 md:gap-6">
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 space-y-4">
				<h3 className="font-semibold mb-2 dark:text-white">Available Rewards</h3>	
				<div className="overflow-x-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
					{rewards.map((reward) => (
						<div key={reward.id} className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 space-y-2">
							<h4>{reward.rewardName}</h4>
							<p>Requires {reward.pointReq} Points</p>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
							<div 
								className="bg-[#C4A777] h-2.5 rounded-full transition-all duration-300"
								style={{ 
									width: `${Math.min((member.point / reward.pointReq) * 100, 100)}%` 
								}}
								/>
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{member.point} / {reward.pointReq} points ({Math.round((member.point / reward.pointReq) * 100)}%)
							</p>
							{member.point >= reward.pointReq ? (
							<button 
								className="bg-[#C4A777] text-white px-4 py-1 rounded text-sm hover:bg-[#B39665] transition-colors"
								onClick={() => onRedeemClick(reward)}
							>
								Redeem
							</button>
							) : (
							<button className="w-full bg-[#C4A777] bg-opacity-50 text-white px-4 py-2 rounded text-sm cursor-not-allowed">
								Not Enough
							</button>
							)}
						</div>
					))}
				</div>
			</div>
			
			{/* Confirmation Modal */}
			{showConfirmModal && (
				<ConfirmRedeemModal selectedReward={selectedReward} setShowConfirmModal={setShowConfirmModal} setShowSuccessModal={setShowSuccessModal} />
			)}

			{showSuccessModal && (
				<SuccessModal/>
			)}
			
			</div>
		</div>
	);
}