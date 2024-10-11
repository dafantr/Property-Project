// import { Label } from '@/components/ui/label';
// import { formattedCountries } from '@/utils/countries';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// const name = 'country';
// function CountriesInput({ defaultValue }: { defaultValue?: string }) {
//   return (
//     <div className='mb-2'>
//       <Label htmlFor={name} className='capitalize'>
//         Country
//       </Label>
//       <Select
//         defaultValue={defaultValue || formattedCountries[0].code}
//         name={name}
//         required
//       >
//         <SelectTrigger id={name}>
//           <SelectValue />
//         </SelectTrigger>
//         <SelectContent>
//           {formattedCountries.map((item) => {
//             return (
//               <SelectItem key={item.code} value={item.code}>
//                 <span className='flex items-center gap-2'>
//                   {item.flag} {item.name}
//                 </span>
//               </SelectItem>
//             );
//           })}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }
// export default CountriesInput;



// countriesInput.tsx (now showing cities in Indonesia)
import { Label } from '@/components/ui/label';
import { formattedCities } from '@/utils/countries'; // import cities, not countries
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const name = 'city'; // Change to 'city'

function CitiesInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='capitalize'>
        City
      </Label>
      <Select
        defaultValue={defaultValue || formattedCities[0].code} // Use first city as default
        name={name}
        required
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {formattedCities.map((item) => {
            return (
              <SelectItem key={item.code} value={item.code}>
                <span className='flex items-center gap-2'>
                  {item.name} ({item.region})
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CitiesInput;
