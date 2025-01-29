import { fetchProfile, fetchMember, fetchReferralDetails, fetchWithdrawalRequest, fetchTierById, getGeneralVariable } from "@/utils/actions";
import { redirect } from "next/navigation";
import ReferralCommission from "@/components/marketing/ReferralCommission";
import { generalVariable, member, tier, WithdrawalRequestDetails } from "@/utils/types";

export default async function ReferralComPage() {
	const profile = await fetchProfile();
	if (!profile) {
		redirect('/profile/create');
	}

	const member = await fetchMember(profile?.clerkId);
	if (member === null) {
		redirect('/member/create');
	}

	const referralDetails = await fetchReferralDetails(member as member);
	if('message' in referralDetails) {
		throw new Error(referralDetails.message);
	}

	const withdrawalRequestDetails = await fetchWithdrawalRequest(member.memberId);
	if('message' in withdrawalRequestDetails) {
		throw new Error(withdrawalRequestDetails.message as string);
	}

	const tier = await fetchTierById(member.tierId);
	if (tier === null) {
		throw new Error('Tier not found');
	}

	const generalVariable = await getGeneralVariable("bookingCommissionRate");
	if (generalVariable === null) {
		throw new Error('General variable not found');
	}

	return (
		<ReferralCommission member={member as member} referralDetails={referralDetails} withdrawalRequestDetails={withdrawalRequestDetails as WithdrawalRequestDetails[]} tier={tier as tier} generalVariable={generalVariable as generalVariable} />
	);
}
