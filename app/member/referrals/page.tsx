import { fetchProfile, fetchMember, fetchBookingCommissionTransaction } from "@/utils/actions";
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

	const bookingCommissionDetails = await fetchBookingCommissionTransaction(member.memberId);

	return (
		<ReferralCommission member={member} bookingCommissionDetails={bookingCommissionDetails} />
	);
}
