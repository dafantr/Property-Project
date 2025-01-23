import { fetchProfile, fetchMember, fetchTierById, fetchReferralDetails } from "@/utils/actions";
import { redirect } from "next/navigation";
import DashboardMarketing from "@/components/marketing/DashboardMarketing";
import { member } from "@/utils/types";

export default async function DashboardPage() {
	const profile = await fetchProfile();
	
	if (!profile) {
		redirect('/profile/create');
	}

	const member = await fetchMember(profile?.clerkId);

	if (member === null) {	
		throw new Error('Marketing Member not found');
	}

	const tier = await fetchTierById(member.tierId);
	if (tier === null) {
		throw new Error('Tier not found');
	}

	const referralDetails = await fetchReferralDetails(member as member);

	if('message' in referralDetails) {
		throw new Error(referralDetails.message);
	}

	return (
		<DashboardMarketing member={member as member} profile={profile} referralDetails={referralDetails} />
	);
}
