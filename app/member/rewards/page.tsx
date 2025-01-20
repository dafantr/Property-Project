import { fetchProfile, fetchMember, fetchRewards, fetchLoyaltyPointDetails } from "@/utils/actions";
import { redirect } from "next/navigation";
import LoyaltiPoints from "@/components/member/LoyaltiPoints";

export default async function RewardsPage() {
	const profile = await fetchProfile();
	if (!profile) {
		redirect('/profile/create');
	}

	const member = await fetchMember(profile?.clerkId);
	if (member === null) {
		redirect('/member/create');
	}

	const rewards = await fetchRewards();
	if ('message' in rewards) {
		throw new Error("Failed to fetch rewards");
	}
	
	const loyaltyPointDetails = await fetchLoyaltyPointDetails(member);
	if ('message' in loyaltyPointDetails) {
		throw new Error("Failed to fetch loyalty point details");
	}

	return (
		<LoyaltiPoints member={member} rewards={rewards} loyaltyPointDetails={loyaltyPointDetails} />
	);
}
