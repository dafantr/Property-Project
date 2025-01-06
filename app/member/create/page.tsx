// app/member/create/page.tsx
import CreateMemberForm from "@/components/member/CreateMemberForm";
import { fetchProfile, fetchMember } from "@/utils/actions";
import { redirect } from "next/navigation";

type Country = {
	cca2: string; // Country code
	name: {
		common: string; // Common name of the country
	};
};

async function fetchCitizenshipOptions() {
	// Option 3: Using Countries Now API
	const response = await fetch("https://countriesnow.space/api/v0.1/countries");
	const data = await response.json();

	// The API returns { data: [ { iso2: "AF", country: "Afghanistan", ... }, ... ] }
	return data.data.map((item: { country: string }) => ({
		value: item.country, // Using iso2 code (e.g., "AF", "AL")
		label: item.country, // Using country name (e.g., "Afghanistan", "Albania")
	}));
}

async function CreateMember() {
	const profile = await fetchProfile();
	const member = await fetchMember(profile.id, undefined);

	const citizenshipOptions = await fetchCitizenshipOptions();

	if (member) redirect("/member/profile");
	return (
		<CreateMemberForm
			profile={profile}
			citizenshipOptions={citizenshipOptions}
		/>
	);
}

export default CreateMember;
