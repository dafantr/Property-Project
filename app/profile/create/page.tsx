'use client'; // Marking this as a client component
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import { createProfileAction } from "@/utils/actions";
import { currentUser } from "@clerk/nextjs/server";
import { useEffect } from "react"; // Import useEffect for side effects
import { useRouter } from "next/navigation"; // Import useRouter for redirection

function CreateProfile() {
  const router = useRouter(); // Create router instance

  useEffect(() => {
    const checkUser = async () => {
      const user = await currentUser();
      if (user?.privateMetadata?.hasProfile) {
        router.push("/"); // Redirect if profile exists
      }
    };
    checkUser(); // Call the async function
  }, [router]); // Dependency array to avoid warnings

  return (
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
  );
}

export default CreateProfile;
