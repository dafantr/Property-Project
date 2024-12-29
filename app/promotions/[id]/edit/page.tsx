import {
    fetchPromotionDetails,
    updatePromotionImageAction,
    updatePromotionAction,
} from '@/utils/actions';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { SubmitButton } from '@/components/form/Buttons';
import { redirect } from 'next/navigation';
import { type Amenity } from '@/utils/amenities';
import ImageInputContainer from '@/components/form/ImageInputContainer';
import CitiesInput from '@/components/form/CitiesInput';

async function EditPromotionPage({ params }: { params: { id: string } }) {
    const promotion = await fetchPromotionDetails(params.id);

    if (!promotion) redirect('/');

    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>Edit Exlusive Highlight</h1>
            <div className='border p-8 rounded-md '>
                <ImageInputContainer
                    name={promotion.title}
                    text='Update Image'
                    action={updatePromotionImageAction}
                    image={promotion.media}
                >
                    <input type='hidden' name='id' value={promotion.id} />
                </ImageInputContainer>

                <FormContainer action={updatePromotionAction}>
                    <input type='hidden' name='id' value={promotion.id} />
                    <div className='grid md:grid-cols-2 gap-8 mb-4 mt-8'>
                        <FormInput
                            name='title'
                            type='text'
                            label='Title (50 limit)'
                            defaultValue={promotion.title}
                        />
                        <FormInput
                            name='subtitle'
                            type='text '
                            label='Subtitle (100 limit)'
                            defaultValue={promotion.subtitle}
                        />
                    </div>

                    <TextAreaInput
                        name='description'
                        labelText='Description (10 - 100 Words)'
                        defaultValue={promotion.description}
                    />
                    <SubmitButton text='edit exlusive highlight' className='mt-12' />
                </FormContainer>
            </div>
        </section>
    );
}
export default EditPromotionPage;