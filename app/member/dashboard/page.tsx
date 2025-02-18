import { fetchProfile, fetchMember, fetchRewards, fetchTierById, fetchReferralDetails, fetchLoyaltyPointDetails, fetchDownlines } from "@/utils/actions";
import { redirect } from "next/navigation";
import DashboardMember from "@/components/member/DashboardMember";

export default async function DashboardPage() {
	const profile = await fetchProfile();
	
	if (!profile) {
		redirect('/profile/create');
	}

	const member = await fetchMember(profile?.clerkId);

	if (member === null) {
		redirect('/member/create');
	}

	const tier = await fetchTierById(member.tierId);
	if (tier === null) {
		throw new Error('Tier not found');
	}
	
	const rewards = await fetchRewards();
	if('message' in rewards) {
		throw new Error('Failed to fetch rewards');
	}

	const referralDetails = await fetchReferralDetails(member);

	if('message' in referralDetails) {
		throw new Error(referralDetails.message);
	}

	const loyaltyPointDetails = await fetchLoyaltyPointDetails(member);
	if('message' in loyaltyPointDetails) {
		throw new Error(loyaltyPointDetails.message);
	}

	const downlines = await fetchDownlines(member.id, 3);
	if (downlines === null) {
	  return new Error('Failed to fetch downlines');
	}

	return (
		<DashboardMember member={member} profile={profile} rewards={rewards} referralDetails={referralDetails} loyaltyPointDetails={loyaltyPointDetails} downlines={downlines} tier={tier} />
	);
}
