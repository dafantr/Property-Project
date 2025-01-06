import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { Users, Gift, Network, RefreshCcw } from "lucide-react";
import { fetchProfile, fetchMember } from "@/utils/actions";
export default async function DashboardPage() {
	const user = await fetchProfile();
	const members = await fetchMember(user?.id, "");
	return (
		<div className="grid grid-cols-2 gap-6">
			{/* User Profile Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
				<div className="flex items-center gap-4 mb-4">
					<Users className="h-8 w-8 text-blue-500" />
					<h2 className="text-xl font-semibold dark:text-white">
						Profile Overview
					</h2>
				</div>
				<div className="space-y-3 dark:text-gray-300">
					<p>
						Name: {user?.firstName} {user?.lastName}
					</p>
					<p>Email: {user?.email}</p>
					<p>
						Member Since: {new Date(user?.createdAt || "").toLocaleDateString()}
					</p>
					{/* <p>Membership Type: {user?.membership_type || "Basic"}</p> */}
					{/* <p>Status: {user?.status || "Active"}</p> */}
				</div>
			</div>

			{/* Referral & Commission Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
				<div className="flex items-center gap-4 mb-4">
					<RefreshCcw className="h-8 w-8 text-green-500" />
					<h2 className="text-xl font-semibold dark:text-white">
						Referrals & Commissions
					</h2>
				</div>
				<div className="space-y-3 dark:text-gray-300">
					<p>Total Referrals: {members?.length || 0}</p>
					<p>
						Active Referrals:{" "}
						{/* {members?.filter((ref) => ref.status === "active").length || 0} */}
					</p>
					<p>
						Total Commission: $
						{/* {members
							?.reduce((acc, ref) => acc + (ref.commission_amount || 0), 0)
							.toFixed(2) || "0.00"} */}
					</p>
					<p>
						Pending Commission: $
						{/* {members
							?.filter((ref) => ref.status === "pending")
							.reduce((acc, ref) => acc + (ref.commission_amount || 0), 0)
							.toFixed(2) || "0.00"} */}
					</p>
				</div>
			</div>

			{/* Loyalty Points Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
				<div className="flex items-center gap-4 mb-4">
					<Gift className="h-8 w-8 text-purple-500" />
					<h2 className="text-xl font-semibold dark:text-white">
						Loyalty Points
					</h2>
				</div>
				<div className="space-y-3 dark:text-gray-300">
					<p>
						Current Points:
						{/* {user?.loyaltyPoints || 0} */}
					</p>
					<p>
						Points to Next Reward:{" "}
						{/* {user?.next_reward_threshold
							  ? user.next_reward_threshold - (user.loyaltyPoints || 0)
							: 100} */}
					</p>
					<div className="mt-4">
						<h3 className="font-semibold mb-2 dark:text-white">
							Available Rewards:
						</h3>
						<ul className="list-disc list-inside">
							<li>500 points: Free Month Subscription</li>
							<li>1000 points: Premium Features Access</li>
							<li>2000 points: Special Member Status</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Downline Tree Card */}
			<div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
				<div className="flex items-center gap-4 mb-4">
					<Network className="h-8 w-8 text-orange-500" />
					<h2 className="text-xl font-semibold dark:text-white">
						Downline Overview
					</h2>
				</div>
				<div className="space-y-3 dark:text-gray-300">
					<p>Direct Downlines: {members?.length || 0}</p>
					<p>Total Network Size: {members?.length || 0}</p>
					<p>
						Network Level:
						{/* {user?.network_level || 1} */}
					</p>
					<div className="mt-4">
						<h3 className="font-semibold mb-2 dark:text-white">
							Recent Downlines:
						</h3>
						<div className="space-y-2">
							{members && members.length > 0 ? (
								members.slice(0, 5).map((member: any) => (
									<div key={member.id} className="flex items-center gap-2">
										<Users className="h-4 w-4 text-gray-400" />
										<span>
											{member.firstName} {member.lastName}
										</span>
									</div>
								))
							) : (
								<p className="text-sm text-gray-500 dark:text-gray-400">
									No downlines yet
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
