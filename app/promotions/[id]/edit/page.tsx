import {
    fetchPromotionDetails, // ✅ Ensure correct function is used
    updatePromotionImageAction,
    updatePromotionAction,
    getAdminUser
} from '@/utils/actions';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { SubmitButton } from '@/components/form/Buttons';
import { redirect } from 'next/navigation';
import ImageInputContainer from '@/components/form/ImageInputContainer';
import CitiesInput from '@/components/form/CitiesInput';
import ExlusiveTypeInput from '@/components/form/ExlucisveTypeInput';

// ✅ Define the correct Promotion type
interface Promotion {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    description: string;
    media: string;
    city?: string;
    createdAt: string;
}

async function EditPromotionPage({ params }: { params: { id: string } }) {
    try {
        await getAdminUser(); // Redirects if not admin

        // ✅ Fetch promotion details correctly
        const promotionData = await fetchPromotionDetails(params.id);

        if (!promotionData) {
            redirect('/');
        }

        // ✅ Convert `createdAt` to a string before assigning
        const promotion: Promotion = {
            ...promotionData,
            createdAt: promotionData.createdAt.toISOString(), // Convert Date to string
        };

        return (
            <section>
                <h1 className='text-2xl font-semibold mb-8 capitalize'>Edit Exclusive Highlight</h1>
                <div className='border p-8 rounded-md '>
                    <ImageInputContainer
                        name={promotion.title}
                        text='Update Image'
                        action={updatePromotionImageAction}
                        id={promotion.id}
                        image={promotion.media}
                    />
                    <FormContainer action={updatePromotionAction}>
                        <input type='hidden' name='id' value={promotion.id} />
                        <div className='grid gap-4 mt-4'>
                            <FormInput
                                label='Title'
                                name='title'
                                type='text'
                                defaultValue={promotion.title}
                            />
                            <FormInput
                                label='Subtitle'
                                name='subtitle'
                                type='text'
                                defaultValue={promotion.subtitle}
                            />
                            <TextAreaInput
                                name='description'
                                labelText='Description'
                                defaultValue={promotion.description}
                            />
                            <CitiesInput defaultValue={promotion.city ?? ""} />
                            <ExlusiveTypeInput defaultValue={promotion.category} />
                            <SubmitButton text='Update' />
                        </div>
                    </FormContainer>
                </div>
            </section>
        );
    } catch (error) {
        console.error("Error fetching promotion details:", error);
        redirect('/');
    }
}

export default EditPromotionPage;