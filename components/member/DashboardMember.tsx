"use client"
import { Copy, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { dashboardMemberProps, reward } from "@/utils/types";
import { formatCurrency } from "@/utils/format";
import DownlinePreview from "./DownlinePreview";
import { useState } from "react";
import SuccessModal from "@/components/ui/SuccessModal";
import ConfirmRedeemModal from "@/components/ui/ConfirmRedeemModal";

export default function DashboardMember({
    member,
    profile,
    rewards,
	tier,
    referralDetails,
	loyaltyPointDetails,
	downlines
}: dashboardMemberProps) {

	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [selectedReward, setSelectedReward] = useState<reward | null>(null);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	const onRedeemClick = (reward: reward) => {
		setSelectedReward(reward);
		setShowConfirmModal(true);
	  };
  
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
				<h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Membership Information</h2>
				<div className="space-y-4 dark:text-gray-300">
                    {/* Member Status */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Member ID:</span>
                            <span className="font-medium">{member.memberId || 'noId'}</span>
                        </div>
						<div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Tier:</span>
                            <span className="font-medium">{tier.tierName || 'noTier'}</span>
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
									<td className="py-2 px-4">{referralDetail.profile.firstName} {referralDetail.profile.lastName}</td>
									<td className="py-2 px-4">{formatCurrency(referralDetail.commission)}</td>
									<td className="py-2 px-4">
										<span className={`px-2 py-1 rounded text-sm ${
											referralDetail.paymentStatus 
											? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
											: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
										}`}>
											{referralDetail.paymentStatus ? 'Approved' : 'Pending'}
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
										<span>{referralDetail.profile.firstName} {referralDetail.profile.lastName}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Amount</span>
										<span className="font-medium">{formatCurrency(referralDetail.commission)}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 dark:text-gray-400">Status</span>
										<span className={`px-2 py-1 rounded text-sm ${
											referralDetail.paymentStatus 
											? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
											: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
										}`}>
											{referralDetail.paymentStatus ? 'Approved' : 'Pending'}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Loyalty Points Card */}
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Loyalty Points & Rewards</h2>
				<p className="text-2xl font-bold text-[#C4A777] dark:text-[#D4B787] mb-4">
					Total Points: {member.point || "0"}
				</p>

				<h3 className="font-semibold mb-2 dark:text-white">Activities Breakdown</h3>
				<div className="overflow-x-auto ">
					{/* Desktop Table */}
					<table className="w-full hidden md:table">
						<tbody className="dark:text-gray-300">
							{loyaltyPointDetails.length > 0 ? (
								loyaltyPointDetails.slice(-3).map((loyaltyPointDetail) => (
									<tr key={loyaltyPointDetail.id} className="border-b border-gray-100 dark:border-zinc-800">
										<td className="py-2 px-4">{loyaltyPointDetail.type} - {loyaltyPointDetail.point} point</td>
									</tr>
								))
							) : (
								<tr>
									<td className="py-2 px-4">No activities found</td>
								</tr>
							)}
						</tbody>
					</table>

					{/* Mobile Cards */}
					<div className="md:hidden space-y-4">
						{loyaltyPointDetails.map((loyaltyPointDetail) => (
							<div key={loyaltyPointDetail.id} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
								<p>{loyaltyPointDetail.type} - {loyaltyPointDetail.point} point</p>
							</div>
						))}
					</div>
				</div>
				
				<br />
				<h3 className="font-semibold mb-2 dark:text-white">Available Rewards</h3>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{rewards?.map((reward) => (
					<div key={reward.id} className="text-center p-3 dark:text-gray-300 border border-gray-200 dark:border-zinc-700">
						<p className="font-semibold">{reward.rewardName}</p>
						<p className="text-sm mb-2">{reward.pointReq} points</p>
						{member.point >= reward.pointReq ? (
						<button 
							className="bg-[#C4A777] text-white px-4 py-1 rounded text-sm hover:bg-[#B39665] transition-colors"
							onClick={() => onRedeemClick(reward)}
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

			{/* Confirmation Modal */}
			{showConfirmModal && (
				<ConfirmRedeemModal selectedReward={selectedReward} setShowConfirmModal={setShowConfirmModal} setShowSuccessModal={setShowSuccessModal} />
			)}

			{showSuccessModal && (
				<SuccessModal message="Reward redeemed successfully"/>
			)}

			{/* Downline Tree Card */}
			<div className="bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Downline Tree Preview</h2>
				<div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg overflow-x-auto">
						<DownlinePreview member={downlines} />
				</div>
			</div>
		</div>
    );
}
