import { Copy, Share2 } from "lucide-react";

interface UpdateMemberFormProps {
    member: {
        id: string;
        memberId: string;
        isActive: number;
        commission: number;
    };
}

export default function ReferralCommission({
	member,
}: UpdateMemberFormProps) {
	return (
		<div className="grid grid-cols-2 gap-6">
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
					<p>Total Referrals: {"0"}</p>
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
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}