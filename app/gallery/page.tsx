import EmptyList from '@/components/home/EmptyList';
import { fetchGalleries, deleteGaleryAction } from '@/utils/actions';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import FormContainer from '@/components/form/FormContainer';
import { IconButton } from '@/components/form/Buttons';

async function GaleriesPage() {
  const galeries = await fetchGalleries();

  if (galeries.length === 0) {
    return (
      <EmptyList
        heading='No rentals to display.'
        message="Don't hesitate to create a rental."
      />
    );
  }

  return (
    <div className='mt-16'>
      <h4 className='mb-4 capitalize'>Total Images : {galeries.length}</h4>
      <Table>
        <TableCaption>A list of all your galeries.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-orange-500 text-white rounded-tl-lg">Media</TableHead>
            <TableHead className="bg-orange-500 text-white ">Title </TableHead>
            <TableHead className="bg-orange-500 text-white rounded-tr-lg">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {galeries.map((galery) => {
            const { id: id, title, media } = galery;
            return (
              <TableRow key={galery.id}>
                <TableCell>
                <img
                    src={media}
                    alt={title}
                    style={{width: '200px', height: '200px', objectFit: 'cover'}} 
                />
                </TableCell>
                <TableCell>{galery.title}</TableCell>

                <TableCell>
                  <DeleteGalery galeryId={galery.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DeleteGalery({ galeryId }: { galeryId: string }) {
  const deleteGalery = deleteGaleryAction.bind(null, { galeryId });
  return (
    <FormContainer action={deleteGalery}>
      <IconButton actionType='delete' />
    </FormContainer>
  );
}

export default GaleriesPage;