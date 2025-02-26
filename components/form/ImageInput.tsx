import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

type ImageInputProps = {
  name: string;
  multiple?: boolean;
};

function ImageInput({ name, multiple = false }: ImageInputProps) {
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
        multiple={multiple} // Allow multiple files if true
        className='max-w-xs'
      />
    </div>
  );
}

export default ImageInput;
