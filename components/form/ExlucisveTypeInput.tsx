import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exclusiveCategories } from '@/utils/exclusiveCategories';

function ExlusiveTypeInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className='mb-2'>
      <Label htmlFor="category" className='capitalize'>
        Category
      </Label>
      <Select
        defaultValue={defaultValue || exclusiveCategories[0].url}
        name="category"
        required
      >
        <SelectTrigger id="category">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {exclusiveCategories.map((item) => {
            return (
              <SelectItem key={item.url} value={item.url}>
                <span className='flex items-center gap-2'>
                  <item.icon /> {item.label}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default ExlusiveTypeInput;