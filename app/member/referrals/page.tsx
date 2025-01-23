import { fetchProfile, fetchMember, fetchReferralDetails, fetchWithdrawalRequest } from "@/utils/actions";
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

	const withdrawalRequestDetails = await fetchWithdrawalRequest(member.profileId);
	if('message' in withdrawalRequestDetails) {
		throw new Error("Failed to fetch withdrawal request details");
	}

	return (
		<ReferralCommission member={member} referralDetails={referralDetails} withdrawalRequestDetails={withdrawalRequestDetails} />
	);
}
