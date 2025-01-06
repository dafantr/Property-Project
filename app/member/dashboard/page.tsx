import { Users, Gift, Network, RefreshCcw, Copy, Share2 } from "lucide-react";
import { fetchProfile, fetchMember } from "@/utils/actions";

export default async function DashboardPage() {
	const user = await fetchProfile();
	const members = await fetchMember(user?.clerkId, "");

	return (
		<div className="grid grid-cols-2 gap-6">
			{/* Profile Information Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-xl font-semibold mb-4 dark:text-white">Profile Information</h2>
				<div className="space-y-2 dark:text-gray-300">
					<p>Member ID: #{user?.id || '123456'}</p>
					<p>Membership Status: <span className="text-green-500 dark:text-green-400">Active</span></p>
					<p>Full Name: {user?.firstName} {user?.lastName}</p>
					<p>Email: {user?.email}</p>
					<p>Phone: {user?.phone}</p>
					<p>Address: {user?.address}</p>
					<p>Gender: {user?.gender}</p>
					<p>Bank Name: {user?.bankName}</p>
					<p>Bank Account Number: {user?.bankAccNum}</p>
					<p>Bank Account Name: {user?.bankAccName}</p>
					<p>Referral Code: REF{user?.id}</p>
					<button className="mt-4 bg-[#C4A777] text-white px-4 py-2 rounded hover:bg-[#B39665] transition-colors">
						Edit Profile
					</button>
				</div>
			</div>

			{/* Referral & Commission Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-xl font-semibold mb-4 dark:text-white">Referral & Commission Overview</h2>
				<div className="mb-4">
					<p className="mb-2 dark:text-gray-300">Unique Referral Code: REF{user?.id}</p>
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
					<p>Total Referrals: {members?.length || 15}</p>
					<p>Total Commissions Earned: ${members?.reduce((acc, ref) => acc + (ref.commission_amount || 0), 0).toFixed(2) || "1500"}</p>
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
							{members?.map((member: any) => (
								<tr key={member.id} className="border-b border-gray-200 dark:border-zinc-700">
									<td className="py-2">{new Date(member.createdAt).toLocaleDateString()}</td>
									<td>{member.firstName} {member.lastName}</td>
									<td>${member.commission_amount}</td>
									<td>{member.status}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Loyalty Points Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-xl font-semibold mb-4 dark:text-white">Loyalty Points & Rewards</h2>
				<p className="text-2xl font-bold text-[#C4A777] dark:text-[#D4B787] mb-4">
					Total Points: {user?.loyaltyPoints || 1200}
				</p>

				<h3 className="font-semibold mb-2 dark:text-white">Activities Breakdown</h3>
				<div className="space-y-2 mb-6 dark:text-gray-300">
					<p>Referral Sign-up - 500 points</p>
					<p>Purchase - 300 points</p>
					<p>Monthly Bonus - 400 points</p>
				</div>

				<h3 className="font-semibold mb-2 dark:text-white">Available Rewards</h3>
				<div className="grid grid-cols-3 gap-4">
					<div className="text-center dark:text-gray-300">
						<p className="font-semibold">Reward 1</p>
						<p className="text-sm mb-2">800 points</p>
						<button className="bg-[#C4A777] text-white px-4 py-1 rounded text-sm hover:bg-[#B39665] transition-colors">
							Redeem
						</button>
					</div>
					<div className="text-center dark:text-gray-300">
						<p className="font-semibold">Reward 2</p>
						<p className="text-sm mb-2">1200 points</p>
						<button className="bg-[#C4A777] text-white px-4 py-1 rounded text-sm hover:bg-[#B39665] transition-colors">
							Redeem
						</button>
					</div>
					<div className="text-center dark:text-gray-300">
						<p className="font-semibold">Reward 3</p>
						<p className="text-sm mb-2">1800 points</p>
						<button className="bg-gray-300 text-gray-600 px-4 py-1 rounded text-sm cursor-not-allowed">
							Not Enough
						</button>
					</div>
				</div>
			</div>

			{/* Downline Tree Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-xl font-semibold mb-4 dark:text-white">Downline Tree Preview</h2>
				<div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg">
					<div className="text-center mb-4 dark:text-gray-300">
						<p>Total Downlines: {members?.length || 5}</p>
						<p>Levels: {user?.network_level || 3}</p>
					</div>
					<div className="flex flex-col items-center">
						<div className="w-16 h-16 rounded-full bg-[#C4A777] text-white flex items-center justify-center mb-4">
							You
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400">REF{user?.id}</p>
						<div className="flex gap-8 mt-4">
							{members?.slice(0, 2).map((member: any, index: number) => (
								<div key={index} className="text-center">
									<div className="w-16 h-16 rounded-full bg-[#C4A777] bg-opacity-80 text-white flex items-center justify-center">
										{member.firstName}
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">REF{member.id}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
