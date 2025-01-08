import { Users, Gift, Network, RefreshCcw, Copy, Share2 } from "lucide-react";
import { fetchProfile, fetchMember, fetchRewards } from "@/utils/actions";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const rewards = await fetchRewards();
	const profile = await fetchProfile();
	
	if (!profile) {
		redirect('/profile/create');
	}

	const member = await fetchMember(profile?.clerkId);

	if (member === null) {
		redirect('/member/create');
	}
	
	return (
		<div className="grid grid-cols-2 gap-6">
			{/* Profile Information Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-xl font-semibold mb-4 dark:text-white">Profile Information</h2>
				<div className="space-y-2 dark:text-gray-300">
					<p>Member ID: {member.memberId || 'noId'}</p>
					<p>Membership Status: <span className="text-green-500 dark:text-green-400">{member.isActive ? 'Active' : 'Inactive'}</span></p>
					<p>Full Name: {profile.firstName} {profile.lastName}</p>
					<p>Email: {profile.email}</p>
					<p>Phone: {profile.phone}</p>
					<p>Address: {profile.address}</p>
					<p>Gender: {profile.gender}</p>
					<p>Bank Name: {profile.bankName}</p>
					<p>Bank Account Number: {profile.bankAccNum}</p>
					<p>Bank Account Name: {profile.bankAccName}</p>
					<p>Referral Code: {member.memberId}</p>
					<button className="mt-4 bg-[#C4A777] text-white px-4 py-2 rounded hover:bg-[#B39665] transition-colors">
						Edit Profile
					</button>
				</div>
			</div>

			{/* Referral & Commission Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-xl font-semibold mb-4 dark:text-white">Referral & Commission Overview</h2>
				<div className="mb-4">
					<p className="mb-2 dark:text-gray-300">Unique Referral Code: {member.memberId}</p>
					<div className="flex gap-2">
						<button className="bg-[#C4A777] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#B39665] transition-colors">
							<Copy className="h-4 w-4" /> Copy Referral Code
						</button>
						<button className="bg-[#C4A777] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#B39665] transition-colors">
							<Share2 className="h-4 w-4" /> Share Referral Link
						</button>
					</div>
				</div>

				<div className="space-y-2 mb-6 dark:text-gray-300">
					<p>Total Referrals: {member.length || "0"}</p>
					<p>Total Commissions Earned: RP. {member.commission || "0"}</p>
				</div>

				<h3 className="font-semibold mb-2 dark:text-white">Commission History</h3>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-gray-200 dark:border-zinc-700">
							<tr className="dark:text-gray-200">
								<th className="text-left py-2">Date</th>
								<th className="text-left py-2">Referral Name</th>
								<th className="text-left py-2">Amount</th>
								<th className="text-left py-2">Status</th>
							</tr>
						</thead>
						<tbody className="dark:text-gray-300">
							{/* {member.map((member: any) => (
								<tr key={member.id} className="border-b border-gray-200 dark:border-zinc-700">
									<td className="py-2">{new Date(member.createdAt).toLocaleDateString()}</td>
									<td>{member.firstName} {member.lastName}</td>
									<td>${member.commission_amount}</td>
									<td>{member.status}</td>
								</tr>
							))} */}
						</tbody>
					</table>
				</div>
			</div>

			{/* Loyalty Points Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-xl font-semibold mb-4 dark:text-white">Loyalty Points & Rewards</h2>
				<p className="text-2xl font-bold text-[#C4A777] dark:text-[#D4B787] mb-4">
					Total Points: {member.point || "0"}
				</p>

				<h3 className="font-semibold mb-2 dark:text-white">Activities Breakdown</h3>
				<div className="space-y-2 mb-6 dark:text-gray-300">
					<p>Referral Sign-up - 500 points</p>
					<p>Purchase - 300 points</p>
					<p>Monthly Bonus - 400 points</p>
				</div>

				<h3 className="font-semibold mb-2 dark:text-white">Available Rewards</h3>
				<div className="grid grid-cols-3 gap-4">
					{rewards?.map((reward) => (
					<div key={reward.id} className="text-center dark:text-gray-300">
						<p className="font-semibold">{reward.rewardName}</p>
						<p className="text-sm mb-2">{reward.pointReq} points</p>
						{member.point >= reward.pointReq ? (
						<button 
							className="bg-[#C4A777] text-white px-4 py-1 rounded text-sm hover:bg-[#B39665] transition-colors"
							onClick={() => handleRedeem(reward.id)}
						>
							Redeem
						</button>
						) : (
						<button className="bg-gray-300 text-gray-600 px-4 py-1 rounded text-sm cursor-not-allowed">
							Not Enough
						</button>
						)}
					</div>
					))}
				</div>
			</div>

			{/* Downline Tree Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-xl font-semibold mb-4 dark:text-white">Downline Tree Preview</h2>
				<div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg">
					<div className="text-center mb-4 dark:text-gray-300">
						<p>Total Downlines: {member.length || 5}</p>
						<p>Levels: {profile.network_level || 3}</p>
					</div>
					<div className="flex flex-col items-center">
						<div className="w-16 h-16 rounded-full bg-[#C4A777] text-white flex items-center justify-center mb-4">
							You
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400">REF{profile?.id}</p>
						<div className="flex gap-8 mt-4">
							{/* {member.slice(0, 2).map((member: any, index: number) => (
								<div key={index} className="text-center">
									<div className="w-16 h-16 rounded-full bg-[#C4A777] bg-opacity-80 text-white flex items-center justify-center">
										{member.firstName}
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">REF{member.id}</p>
								</div>
							))} */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
