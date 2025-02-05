import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

function ImageInput() {
  const name = 'image';
  
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>
        Images (You can upload multiple)
      </Label>
      <Input
        id={name}
        name={name}
        type='file'
        required
        accept='image/*'
        multiple // Allow multiple files
        className='max-w-xs'
      />
    </div>
  );
}

export default ImageInput;
