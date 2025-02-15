import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

interface ImageInputProps {
  name?: string; // ✅ Make name optional
  multiple?: boolean; // ✅ Make multiple optional
}

function ImageInput({ name = "image", multiple = false }: ImageInputProps) {
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
        multiple={multiple} // ✅ Use multiple prop
        className='max-w-xs'
      />
    </div>
  );
}

export default ImageInput;