// page.tsx
'use client'; // Keep this as a client component
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import { createProfileAction } from "@/utils/actions";
import CheckUser from "@/components/CheckUser"; // Import the new CheckUser component

function CreateProfile() {
  return (
    <CheckUser>
      <section>
        <h1 className="text-2xl font-semibold mb-8 capitalize">User Profile</h1>
        <div className="border p-8 rounded-md ">
          {/* Image container */}
          <FormContainer action={createProfileAction}>
            <div className="grid md:grid-cols-2 gap-4 mt-4 ">
              <FormInput type="text" name="firstName" label="First Name" />
              <FormInput type="text" name="lastName" label="Last Name" />
              <FormInput type="text" name="username" label="Username" />
            </div>
            <SubmitButton text="Create Profile" className="mt-8" />
          </FormContainer>
        </div>
      </section>
    </CheckUser>
  );
}

export default CreateProfile;
