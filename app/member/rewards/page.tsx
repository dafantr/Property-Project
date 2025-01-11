import { fetchProfile, fetchMember, fetchRewards } from "@/utils/actions";
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
		// Handle error case, maybe redirect or show empty array
		return <LoyaltiPoints member={member} rewards={[]} />;
	}
	
	return (
		<LoyaltiPoints member={member} rewards={rewards} />
	);
}
