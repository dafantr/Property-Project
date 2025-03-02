'use client';

import FormContainer from "@/components/form/FormContainer";
import { createOverviewContentAction } from "@/utils/actions";
import FormInput from "@/components/form/FormInput";
import { SubmitButton } from "@/components/form/Buttons";
import { useState } from "react";
import SingleImageInput from "@/components/form/SingleImageInput";
import { useRouter } from "next/navigation";
import SuccessModal from "@/components/ui/SuccessModal";
import ErrorModal from "@/components/ui/ErrorModal";

export default function OverviewContent() {
    const [type, setType] = useState('steps');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const router = useRouter();

    return (
    <section>
        <div className="border p-8 rounded-md ">        
            <h1 className="text-2xl font-bold dark:text-white">Overview Content</h1>

            <FormContainer action={
                async (prevState: any, formData: FormData) => {
                    const file = formData.get('contentImage') as File;
                    formData.append('contentImage', file);

                    const result = await createOverviewContentAction(prevState, formData);

                    if (result.status === "success") {
                        setShowSuccessModal(true);
                        setTimeout(() => {
                            setShowSuccessModal(false);
                            router.push('/admin/dashboard');
                        }, 2000);
                    } else {
                        setShowErrorModal(true);
                        setTimeout(() => {
                            setShowErrorModal(false);
                            router.push('/admin/dashboard');
                        }, 2000);
                    }
                    return { message: result.message , status: result.status};
                }
            }>
              <div className="grid md:grid-cols-2 gap-4 mt-4 ">
                <FormInput
                  type="text"
                  name="title"
                  label="Title"
                  placeholder="Enter title"
                />
                <FormInput
                  type="text"
                  name="description"
                  label="Description"
                  placeholder="Enter description"
                />
                <div className="form-group">
		    		<label
		    			htmlFor="type"
		    			className={`block mb-2 text-sm font-medium`}>
		    			Type
		    		</label>
		    		<select
		    			id="type"
		    			name="type"
		    			className={`w-full px-4 py-2 rounded-lg border dark:bg-black dark:border-gray-700 dark:text-white`}
		    			required
                        onChange={(e) => setType(e.target.value)}>
		    			<option value="">Select Type</option>
		    			<option value="steps">Steps</option>
		    			<option value="review">Review</option>
		    		</select>
		    	</div>

                {type === 'review' && (
                    <FormInput
                        type="text"
                        name="author"
                        label="Author"
                        placeholder="Enter author name"
                    />
                )}

                <div className="form-group">
                    <label className="block mb-2 text-sm font-medium dark:text-gray-200">
                        Upload Content Image
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <SingleImageInput  name="contentImage" />
                </div> 

              </div>
              <SubmitButton text="Insert Content" className="mt-8" />
            </FormContainer>
        </div>
        {showSuccessModal && (
            <SuccessModal
                message="Content created successfully"
            />
        )}
        {showErrorModal && (
            <ErrorModal
                message="Failed to create content"
            />
        )}
    </section>
    )
}
