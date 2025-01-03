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
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries: Country[] = await response.json();
    return countries.map((country) => ({
        value: country.cca2,
        label: country.name.common,
    }));
  }

async function CreateMember() {
    const profile = await fetchProfile();
    const member = await fetchMember(profile.id);

    const citizenshipOptions = await fetchCitizenshipOptions();

    if (member) redirect('/member/profile');
    return (
        <CreateMemberForm profile={profile} citizenshipOptions={citizenshipOptions} />
    );
};

export default CreateMember;