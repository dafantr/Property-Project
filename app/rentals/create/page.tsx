import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createPropertyAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Buttons';
import PriceInput from '@/components/form/PriceInput';
import CategoriesInput from '@/components/form/CategoriesInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import CitiesInput from '@/components/form/CitiesInput';
import ImageInput from '@/components/form/ImageInput';
import CounterInput from '@/components/form/CounterInput';
import AmenitiesInput from '@/components/form/AmenitiesInput';
function CreatePropertyPage() {
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>
        Create property
      </h1>
      <div className='border p-8 rounded'>
        <h3 className='text-lg mb-4 font-medium'>Property Information</h3>
        <FormContainer action={createPropertyAction}>
          <div className='grid md:grid-cols-2 gap-8 mb-4'>
            <FormInput
              name='name'
              type='text'
              label='Name (20 limit)'
              defaultValue='Cabin in Latvia'
            />
            <FormInput
              name='tagline'
              type='text'
              label='Tagline (30 limit)'
              defaultValue='Dream Getaway Awaits You Here'
            />
            <PriceInput />
            <CategoriesInput />
          </div>
          <TextAreaInput
            name='description'
            labelText='Description (10 - 1000 words)'
          />
          <div className='grid sm:grid-cols-2 gap-8 mt-4'>
            <CitiesInput />
            <FormInput
              name="googleMapsUrl"
              type="text"
              label="Google Maps URL"
              placeholder="Paste the Google Maps Embed URL here"
              required
            />
            <ImageInput name='image' multiple />
          </div>
          <h3 className='text-lg mt-8 mb-4 font-medium'>
            Accommodation Details
          </h3>
          <CounterInput detail='guests' />
          <CounterInput detail='bedrooms' />
          <CounterInput detail='beds' />
          <CounterInput detail='baths' />
          <h3 className='text-lg mt-10 mb-6 font-medium'>Amenities</h3>
          <AmenitiesInput />
          <SubmitButton text='create rental' className='mt-12' />
        </FormContainer>
      </div>
    </section>
  );
}
export default CreatePropertyPage;