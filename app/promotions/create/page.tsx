import FormInput from '@/components/form/FormInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import FormContainer from '@/components/form/FormContainer';
import { createPromotionAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Buttons';
import ImageInput from '@/components/form/ImageInput';
import ExlucisveTypeInput from '@/components/form/ExlucisveTypeInput';
function CreatePromotionPage() {
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>
        Create Exclusive Highlight
      </h1>
      <div className='border p-8 rounded'>
        <h3 className='text-lg mb-4 font-medium'>Exclusive Highlight Information</h3>
        <FormContainer action={createPromotionAction}>
          <div className='grid md:grid-cols-2 gap-8 mb-4'>
          <FormInput
              name='title'
              type='text'
              label='Title (50 limit)'
              defaultValue='Cabin in Latvia'
            />
            <FormInput
              name='subtitle'
              type='text'
              label='Subtitle (100 limit)'
              defaultValue='Cabin in Latvia nestled in a beautiful olive orchard'
            />
            
            <TextAreaInput
              name='description'
              labelText='Description (10 - 1000 words)'
            />
            <ExlucisveTypeInput />
            <ImageInput name='image' />
          </div>
          <SubmitButton text='create Exclusive Highlight' className='mt-5' />
        </FormContainer>
      </div>
    </section>
  );
}
export default CreatePromotionPage;