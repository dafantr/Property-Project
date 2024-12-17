import FormInput from '@/components/form/FormInput';
import FormContainer from '@/components/form/FormContainer';
import { createGalleryAction } from '@/utils/actions';
import { SubmitButton } from '@/components/form/Buttons';
import ImageInput from '@/components/form/ImageInput';
function CreateGalleryPage() {
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>
        Create Galery
      </h1>
      <div className='border p-8 rounded'>
        <h3 className='text-lg mb-4 font-medium'>Galery Information</h3>
        <FormContainer action={createGalleryAction}>
          <div className='grid md:grid-cols-2 gap-8 mb-4'>
            <FormInput
              name='title'
              type='text'
              label='Title'
            />
            <ImageInput />
          </div>
          <SubmitButton text='create galery' className='mt-5' />
        </FormContainer>
      </div>
    </section>
  );
}
export default CreateGalleryPage;