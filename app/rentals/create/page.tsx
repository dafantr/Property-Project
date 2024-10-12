import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createPropertyAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Buttons';
import PriceInput from '@/components/form/PriceInput';
import CategoriesInput from '@/components/form/CategoriesInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import ImageInput from '@/components/form/ImageInput';
import CountriesInput from '@/components/form/CountriesInput';
import CounterInput from '@/components/form/CounterInput';
import AmenitiesInput from '@/components/form/AmenitiesInput';

function CreateProperty() {
    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>
                Add new Property
            </h1>
            <div className='border p-8 rounded-md'>
                <h3 className='text-lg mb-4 font-medium'>General Info</h3>
                <FormContainer action={createPropertyAction}>
                    <div className='grid md:grid-cols-2 gap-8 mb-4'>
                        <FormInput
                            name='name'
                            type='text'
                            label='Name (20 limit)'
                            defaultValue='Sakura Panglima Polim'
                        />
                        <FormInput
                            name='tagline'
                            type='text '
                            label='Tagline (30 limit)'
                            defaultValue='Liburan Impian Menanti Anda di Sini!'
                        />
                        {/* price */}
                        <PriceInput />
                        {/* categories */}
                        <CategoriesInput />
                    </div>
                    {/* text area / description */}
                    <TextAreaInput name='description' labelText='Description (10 - 1000 Words)' />
                    <div className='grid sm:grid-cols-2 gap-8 mt-4'>
                        <CountriesInput />
                        <ImageInput />
                    </div>
                    <h3 className='text-lg mt-8 mb-4 font-medium'>Accommodation Details</h3>
                    <CounterInput detail='Guests' />
                    <CounterInput detail='Bedrooms' />
                    <CounterInput detail='Beds' />
                    <CounterInput detail='Baths' />
                    <h3 className='text-lg mt-10 mb-6 font-medium'>Amenities</h3>
                    <AmenitiesInput />
                    <SubmitButton text='Create Property' className='mt-12' />
                </FormContainer>
            </div>
        </section>
    );
}
export default CreateProperty;