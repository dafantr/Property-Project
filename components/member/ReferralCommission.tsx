"use client"
import { formatCurrency } from "@/utils/format";
import { ReferralCommissionProps } from "@/utils/types";
import { Copy, Share2 } from "lucide-react";

export default function ReferralCommission({
	member,
	bookingCommissionDetails,
}: ReferralCommissionProps) {
	return (
		<div className="grid grid-cols-1 gap-4 md:gap-6">
			{/* Referral & Commission Card */}
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Referral & Commission Overview</h2>
				<div className="mb-4">
					<p className="mb-2 dark:text-gray-300">Unique Referral Code: {member.memberId}</p>
					<div className="flex flex-col sm:flex-row gap-2">
						<button className="w-full sm:w-auto bg-[#C4A777] text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-[#B39665] transition-colors">
							<Copy className="h-4 w-4" /> Copy Referral Code
						</button>
						<button className="w-full sm:w-auto bg-[#C4A777] text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-[#B39665] transition-colors">
							<Share2 className="h-4 w-4" /> Share Referral Link
						</button>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 md:gap-6">
				<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
					<h3 className="font-semibold mb-2 dark:text-white">Total Referrals</h3>
					<p>{bookingCommissionDetails.length}</p>
				</div>
				<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
					<h3 className="font-semibold mb-2 dark:text-white">Total Commissions Earned</h3>
					<p>{formatCurrency(member.commission)}</p>
				</div>
			</div>
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
			<h3 className="font-semibold mb-2 dark:text-white">Commission History</h3>
				<div className="overflow-x-auto">
					{/* Desktop Table */}
					<table className="w-full hidden md:table">
						<thead className="border-b border-gray-200 dark:border-zinc-700">
							<tr className="dark:text-gray-200">
								<th className="text-left py-2 px-4">Date</th>
								<th className="text-left py-2 px-4">Referral Name</th>
								<th className="text-left py-2 px-4">Amount</th>
								<th className="text-left py-2 px-4">Status</th>
							</tr>
						</thead>
						<tbody className="dark:text-gray-300">
							{bookingCommissionDetails.map((bookingCommissionDetail) => (
								<tr key={bookingCommissionDetail.id} className="border-b border-gray-100 dark:border-zinc-800">
									<td className="py-2 px-4">{bookingCommissionDetail.createdAt.toLocaleDateString()}</td>
									<td className="py-2 px-4">{bookingCommissionDetail.profile.firstName} {bookingCommissionDetail.profile.lastName}</td>
									<td className="py-2 px-4">{formatCurrency(bookingCommissionDetail.commission)}</td>
									<td className="py-2 px-4">
										<span className={`px-2 py-1 rounded text-sm ${
											bookingCommissionDetail.booking.paymentStatus 
											? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
											: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
										}`}>
											{bookingCommissionDetail.booking.paymentStatus ? 'Approved' : 'Pending'}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Mobile Cards */}
					<div className="md:hidden space-y-4">
						{bookingCommissionDetails.map((bookingCommissionDetail) => (
							<div 
								key={bookingCommissionDetail.id} 
								className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700"
							>
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Date</span>
										<span>{bookingCommissionDetail.createdAt.toLocaleDateString()}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Referral</span>
										<span>{bookingCommissionDetail.profile.firstName} {bookingCommissionDetail.profile.lastName}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Amount</span>
										<span>{formatCurrency(bookingCommissionDetail.commission)}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Status</span>
										<span className={`px-2 py-1 rounded text-sm ${
											bookingCommissionDetail.booking.paymentStatus 
											? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
											: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
										}`}>
											{bookingCommissionDetail.booking.paymentStatus ? 'Approved' : 'Pending'}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}