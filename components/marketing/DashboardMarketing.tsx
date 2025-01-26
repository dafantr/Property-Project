"use client"
import { Copy, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { dashboardMarketingProps } from "@/utils/types";
import { formatCurrency } from "@/utils/format";
import { useState } from "react";

export default function DashboardMarketing({
    member,
    profile,
    referralDetails,
}: dashboardMarketingProps) {
 
    const router = useRouter();

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 gap-6">
			{/* Profile Information Card */}
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Marketing Member Information</h2>
				<div className="space-y-4 dark:text-gray-300">
                    {/* Member Status */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Member ID:</span>
                            <span className="font-medium">{member.memberId || 'noId'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Membership Status:</span>
                            <span className={`px-2 py-1 rounded text-sm ${
                                member.isActive 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                                {member.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    {/* Personal & Banking Info */}
                    <div className="space-y-2 pt-2">
                    <h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Profile Information</h2>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Full Name:</span>
                            <span>{profile.firstName} {profile.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Email:</span>
                            <span>{profile.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                            <span>{member.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Address:</span>
                            <span className="text-right max-w-[60%]">{member.address}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                            <span className="capitalize">{member.gender}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Bank Name:</span>
                            <span>{member.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Account Number:</span>
                            <span>{member.bankAccNum}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Account Name:</span>
                            <span>{member.bankAccName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Referral Code:</span>
                            <span>{member.memberId}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => router.push('/member/profile')} 
                        className="w-full mt-4 bg-[#C4A777] text-white px-4 py-2 rounded hover:bg-[#B39665] transition-colors"
                    >
                        Edit Profile
                    </button>
                </div>
			</div>

			{/* Referral & Commission Card */}
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Referral & Commission Overview</h2>
				<div className="mb-4">
					<p className="mb-2 dark:text-gray-300">Unique Referral Code: {member.memberId}</p>
					<div className="flex flex-col sm:flex-row gap-2">
						<button 
							onClick={copyToClipboard}
							className="w-full sm:w-auto bg-[#C4A777] text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-[#B39665] transition-colors"
							>
							<Copy className="h-4 w-4" />
							{copied ? "Copied!" : "Copy Referral Code"}
						</button>
						<button 
							onClick={handleShare}
							className="w-full sm:w-auto bg-[#C4A777] text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-[#B39665] transition-colors"
							>
							<Share2 className="h-4 w-4" /> 
							Share Referral Link
						</button>
					</div>
				</div>

				<div className="space-y-2 mb-6 dark:text-gray-300">
					<p>Total Referrals: {referralDetails.length || "0"}</p>
					<p>Total Commissions Earned: {formatCurrency(member.commission || 0)}</p>
				</div>

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
							{referralDetails.map((referralDetail) => (
								<tr key={referralDetail.id} className="border-b border-gray-100 dark:border-zinc-800">
									<td className="py-2 px-4">{referralDetail.createdAt.toLocaleDateString()}</td>
									<td className="py-2 px-4">{referralDetail.member.profile.firstName} {referralDetail.member.profile.lastName}</td>
									<td className="py-2 px-4">{formatCurrency(referralDetail.commission)}</td>
									<td className="py-2 px-4">
										<span className={`px-2 py-1 rounded text-sm ${
											referralDetail.booking?.paymentStatus || referralDetail.membershipCommissionTransaction?.paymentStatus
											? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
											: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
										}`}>
											{(referralDetail.booking?.paymentStatus || referralDetail.membershipCommissionTransaction?.paymentStatus) ? 'Approved' : 'Pending'}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Mobile Cards */}
					<div className="md:hidden space-y-4">
						{referralDetails.map((referralDetail) => (
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
										<span>{referralDetail.member.profile.firstName} {referralDetail.member.profile.lastName}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Amount</span>
										<span className="font-medium">{formatCurrency(referralDetail.commission)}</span>
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
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
    );
}
