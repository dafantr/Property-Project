import FormContainer from "@/components/form/FormContainer";
import {
  updateMemberAction,
  fetchProfile,
  fetchMember,
} from "@/utils/actions";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import { redirect } from "next/navigation";
//import { profile } from "console";

async function ProfilePage() {
  const profile = await fetchProfile();

  if (!profile) redirect("/profile/create");

  const member = await fetchMember(profile.clerkId);

  if(member === null) redirect ("/member/create");

  console.log(member);
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">Member Profile</h1>
      <div className="border p-8 rounded-md ">
        <FormContainer action={updateMemberAction}>
          <div className="grid md:grid-cols-2 gap-4 mt-4 ">
            <FormInput
              type="text"
              name="memberId"
              label="Member ID"
              defaultValue={member.memberId}
            />
            <FormInput
              type="text"
              name="membershipStatus"
              label="Membership Status"
              defaultValue={member.isActive ? "Active" : "Inactive"}
            />
            <FormInput
              type="text"
              name="fullName"
              label="Full Name"
              defaultValue={profile.firstName + " " + profile.lastName}
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
    </section>
  );
  
}
export default ProfilePage;
