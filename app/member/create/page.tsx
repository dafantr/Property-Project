// app/member/create/page.tsx
import CreateMemberForm from "@/components/member/CreateMemberForm";
import { fetchProfile, fetchMember } from "@/utils/actions";
import { redirect } from "next/navigation";

async function fetchCitizenshipOptions() {
	// Option 3: Using Countries Now API
	const response = await fetch("https://countriesnow.space/api/v0.1/countries");
	const data = await response.json();

	// The API returns { data: [ { iso2: "AF", country: "Afghanistan", ... }, ... ] }
	return data.data.map((item: { country: string , iso2: string }) => ({
		value: item.iso2, // Using iso2 code (e.g., "AF", "AL")
		label: item.country, // Using country name (e.g., "Afghanistan", "Albania")
	}));
}

async function CreateMember() {
	const profile = await fetchProfile();
	
	if (!profile) {
		redirect('/profile/create');
	}

	const member = await fetchMember(profile.clerkId);

	const citizenshipOptions = await fetchCitizenshipOptions();

	if (member !== null) redirect("/member/profile");
	return (
		<CreateMemberForm
			profile={profile}
			citizenshipOptions={citizenshipOptions}
		/>
	);
}

export default CreateMember;
