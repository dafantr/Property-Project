"use client"
import { formatCurrency } from "@/utils/format";
import { ReferralCommissionProps } from "@/utils/types";
import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import WithdrawalHistoryModal from "@/components/ui/WithdrawalHistoryModal";

export default function ReferralCommission({
	member,
	referralDetails,
	withdrawalRequestDetails,
	tier,
	generalVariable,
}: ReferralCommissionProps) {

	const [showWithdrawalHistoryModal, setShowWithdrawalHistoryModal] = useState(false);

	const onWithdrawClick = () => {
		setShowWithdrawalHistoryModal(true);
	  };

	const [copied, setCopied] = useState(false);

	const referralLink = `${process.env.NEXT_PUBLIC_URL}/sign-up?ref=${member.memberId}`;
	const referralCode = `${member.memberId}`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(referralCode);
		setCopied(true);
		
		// Reset the "Copied!" message after 2 seconds
		setTimeout(() => {
		setCopied(false);
		}, 2000);
	};

	const handleShare = async () => {
		// Check if Web Share API is supported
		if (navigator.share) {
		  try {
			await navigator.share({
			  title: 'Join with my referral link',
			  text: 'Sign up using my referral link!',
			  url: referralLink,
			});
		  } catch (error) {
			// User cancelled or share failed
			console.log('Share failed:', error);
		  }
		} else {
		  // Fallback to copying to clipboard
		  navigator.clipboard.writeText(referralLink);
		}
	  };

	  const [statusFilter, setStatusFilter] = useState('all');

	  const filteredReferrals = referralDetails.filter(detail => 
		statusFilter === 'all' || 
		(statusFilter === 'approved' && (detail.booking?.paymentStatus || detail.membershipCommissionTransaction?.paymentStatus)) ||
		(statusFilter === 'pending' && !(detail.booking?.paymentStatus || detail.membershipCommissionTransaction?.paymentStatus))
	  );
	  
	return (
		<div className="grid grid-cols-1 gap-4 md:gap-6">
			{/* Referral & Commission Card */}
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
			<h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Referral & Commission Overview</h2>
				<div className="mb-4">
					<div className="flex flex-col sm:flex-row gap-2">
					<p className="dark:text-gray-300">Unique Referral Code: {member.memberId} </p>
						<button 
							onClick={copyToClipboard}
							className=""
							>
							{copied ? <Check className="h-4 w-4 text-[#B39665] hover:text-[#C4A777] transition-colors" /> : <Copy className="h-4 w-4 text-[#B39665] hover:text-[#C4A777] transition-colors" />}
						</button>
						<button 
							onClick={handleShare}
							className=""
							>
							<Share2 className="h-4 w-4 text-[#B39665] hover:text-[#C4A777] transition-colors" /> 
						</button>
					</div>
					<p className="dark:text-gray-300">{tier.tierName || 'noTier'}</p>
					<p className="dark:text-gray-300">Membership Referral Commission: {tier.commission}%</p>
					<p className="dark:text-gray-300">Booking Referral Commission: {generalVariable.variableValue}%</p>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4 md:gap-6">
				<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
					<h3 className="font-semibold mb-2 dark:text-white">Total Referrals</h3>
					<p>{referralDetails.length}</p>
				</div>
				<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
					<div className="flex justify-between items-center">
						<div>
							<h3 className="font-semibold mb-2 dark:text-white">Total Commissions Earned</h3>
							<p>{formatCurrency(member.commission)}</p>
						</div>
						<button 
							className="px-4 py-2 bg-[#C4A777] hover:bg-[#B39665] text-white text-sm rounded transition-colors"
							onClick={onWithdrawClick}
							>
							Withdraw
						</button>
					</div>
				</div>
			</div>

			{showWithdrawalHistoryModal && (
				<WithdrawalHistoryModal member={member} withdrawalRequestDetails={withdrawalRequestDetails} setShowWithdrawalHistoryModal={setShowWithdrawalHistoryModal} />
			)}

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
								<th className="text-left py-2 px-4">Status : 
									<select
										className="py-1.5 text-sm rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
										value={statusFilter}
										onChange={(e) => setStatusFilter(e.target.value)}
										>
										<option value="all">All</option>
										<option value="approved">Approved</option>
										<option value="pending">Pending</option>
									</select>
								</th>
								<th className="text-left py-2 px-4">Source</th>
							</tr>
						</thead>
						<tbody className="dark:text-gray-300">
							{filteredReferrals.map((referralDetail) => (
								<tr key={referralDetail.id} className="border-b border-gray-100 dark:border-zinc-800">
									<td className="py-2 px-4">{referralDetail.createdAt.toLocaleDateString()}</td>
									<td className="py-2 px-4">{referralDetail.member?.profile.firstName} {referralDetail.member?.profile.lastName}</td>
									<td className="py-2 px-4">{formatCurrency(referralDetail.commission)}</td>
									<td className="py-2 px-4">
										<span className={`px-2 py-1 rounded text-sm ${
											(referralDetail.booking?.paymentStatus || referralDetail.membershipCommissionTransaction?.paymentStatus)
												? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
												: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
										}`}>
											{(referralDetail.booking?.paymentStatus || referralDetail.membershipCommissionTransaction?.paymentStatus) ? 'Approved' : 'Pending'}
										</span>
									</td>
									<td className="py-2 px-4">
										<span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
											{referralDetail.type}
										</span>
									</td>
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
						</select>
					</div>

					{/* Mobile Cards */}
					<div className="md:hidden space-y-4">
						{filteredReferrals.map((referralDetail) => (
							<div 
								key={referralDetail.id} 
								className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700"
							>
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Date</span>
										<span>{referralDetail.createdAt.toLocaleDateString()}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Referral</span>
										<span>{referralDetail.member?.profile.firstName} {referralDetail.member?.profile.lastName}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Amount</span>
										<span>{formatCurrency(referralDetail.commission)}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Status</span>
										<span className={`px-2 py-1 rounded text-sm ${
											(referralDetail.booking?.paymentStatus || referralDetail.membershipCommissionTransaction?.paymentStatus)
												? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
												: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
										}`}>
											{(referralDetail.booking?.paymentStatus || referralDetail.membershipCommissionTransaction?.paymentStatus) ? 'Approved' : 'Pending'}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Source</span>
										<span>{referralDetail.type}</span>
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