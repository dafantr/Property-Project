import { fetchProfile, fetchMember, fetchBookingCommissionTransaction, fetchReferralDetails } from "@/utils/actions";
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

	const referralDetails = await fetchReferralDetails(member);
	if('message' in referralDetails) {
		throw new Error(referralDetails.message);
	}

	return (
		<ReferralCommission member={member} referralDetails={referralDetails} />
	);
}
