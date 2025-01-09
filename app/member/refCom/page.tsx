import { Copy, Share2 } from "lucide-react";
import { fetchProfile, fetchMember, fetchRewards } from "@/utils/actions";
import { redirect } from "next/navigation";
import ReferralCommission from "@/components/member/ReferralCommission";

export default async function ReferralComPage() {
	const profile = await fetchProfile();
	if (!profile) {
		redirect('/profile/create');
	}

	const member = await fetchMember(profile?.clerkId);
	if (member === null) {
		redirect('/member/create');
	}
	
	return (
		<ReferralCommission member={member} />
	);
}
