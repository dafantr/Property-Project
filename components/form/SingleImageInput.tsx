import { Input } from "../ui/input";

type SingleImageInputProps = {
  name: string;
};

function SingleImageInput({ name }: SingleImageInputProps) {
  return (
    <div className='mb-2'>
      <Input
        id={name}
        name={name}
        type='file'
        required
        accept='image/*'
        className='max-w-xs'
      />
    </div>
  );
}

export default SingleImageInput;
