import {
  fetchProfile,
  fetchMember,
} from "@/utils/actions";
import { redirect } from "next/navigation";
import UpdateMemberForm from "@/components/marketing/UpdateMemberForm";
import { member } from "@/utils/types";
//import { profile } from "console";

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
	return data.data.map((item: { country: string , iso2: string }) => ({
		value: item.iso2, // Using iso2 code (e.g., "AF", "AL")
		label: item.country, // Using country name (e.g., "Afghanistan", "Albania")
	}));
}

async function ProfilePage() {
  const profile = await fetchProfile();

  if (!profile) redirect("/profile/create");

  const member = await fetchMember(profile.clerkId);

  if(member === null || member.isActive === 0) redirect ("/member/create");

  const citizenshipOptions = await fetchCitizenshipOptions();

  return (
    <UpdateMemberForm
			profile={profile}
			member={member as member}
			citizenshipOptions={citizenshipOptions}
		/>
  );
  
}
export default ProfilePage;


{/* <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">Member Profile</h1>
      <div className="border p-8 rounded-md ">
        <FormContainer action={updateMemberAction}>
          <div className="grid md:grid-cols-2 gap-4 mt-4 ">
            <FormInput
              type="text"
              name="memberId"
              label="Member ID"
              defaultValue={member.memberId}
              disabled={true}
            />
            <FormInput
              type="text"
              name="membershipStatus"
              label="Membership Status"
              defaultValue={member.isActive ? "Active" : "Inactive"}
              disabled={true}
            />
            <FormInput
              type="text"
              name="fullName"
              label="Full Name"
              defaultValue={profile.firstName + " " + profile.lastName}
              disabled={true}
            />
            <FormInput
              type="text"
              name="citizenship"
              label="Citizenship" 
              defaultValue={profile.citizen ?? undefined}
            />
            <FormInput
              type="text"
              name="dateOfBirth"
              label="Date of Birth" 
              defaultValue={profile.dob ?? undefined}
            />
            <FormInput
              type="text"
              name="address"
              label="Address" 
              defaultValue={profile.address ?? undefined}
            />
            <FormInput
              type="text"
              name="gender  "
              label="Gender" 
              defaultValue={profile.gender ?? undefined}
            />
            <FormInput
              type="text"
              name="email"
              label="Email Address" 
              defaultValue={profile.email ?? undefined}
            />
            <FormInput
              type="text"
              name="phone"
              label="Phone Number" 
              defaultValue={profile.phone ?? undefined}
            />
            <FormInput
              type="text"
              name="bankName"
              label="Bank Name" 
              defaultValue={profile.bankName ?? undefined}
            />
            <FormInput
              type="text"
              name="bankAccNum"
              label="Bank Account Number" 
              defaultValue={profile.bankAccNum ?? undefined}
            />
            <FormInput
              type="text"
              name="bankAccName"
              label="Bank Account Name" 
              defaultValue={profile.bankAccName ?? undefined}
            />
          </div>
          <SubmitButton text="Apply Changes" className="mt-8" />
        </FormContainer>
      </div>
    </section> */}