"use client"
import { redeemReward } from "@/utils/actions";
import { LoyaltiPointsProps, Reward } from "@/utils/types";

export default function LoyaltiPoints({
	member,
	rewards,
}: LoyaltiPointsProps) {

	const handleRedeem = (reward : Reward) => {
		try {
			redeemReward(reward);
			console.log(reward.rewardName);
		} catch (error) {
			console.log("Failed to redeem reward.");
		}
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:gap-6">
			{/* Referral & Commission Card */}
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h1 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Total Points : {member.point || 0}</h1>
			</div>
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
			<h3 className="font-semibold mb-2 dark:text-white">Points History</h3>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-gray-200 dark:border-zinc-700">
							<tr className="dark:text-gray-200">
								<th className="text-left py-2">Date</th>
								<th className="text-left py-2">Activity Description</th>
								<th className="text-left py-2">Points Earned</th>
							</tr>
						</thead>
						<tbody className="dark:text-gray-300">
						</tbody>
					</table>
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
								onClick={() => handleRedeem(reward)}
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
			
			
			</div>
		</div>
	);
}