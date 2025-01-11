import { fetchProfile, fetchMember, fetchRewards, fetchTierById, fetchBookingCommissionTransaction } from "@/utils/actions";
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
		throw new Error(rewards.message);
	}

	const bookingCommissionDetails = await fetchBookingCommissionTransaction(member.memberId);

	return (
		<DashboardMember member={member} profile={profile} rewards={rewards} tier={tier} bookingCommissionDetails={bookingCommissionDetails} />
	);
}
