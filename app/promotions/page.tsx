import EmptyList from '@/components/home/EmptyList';
import { fetchPromotions, deletePromotionAction } from '@/utils/actions';
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

async function ExclusiveHighlighPage() {
  let promotions = await fetchPromotions();

  // Sort promotions by 'createdAt' in descending order
  promotions = promotions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (promotions.length === 0) {
    return (
      <EmptyList
        heading="No rentals to display."
        message="Don't hesitate to create an Exclusive Highlight."
      />
    );
  }

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">Total Images : {promotions.length}</h4>
      <Table>
        <TableCaption>A list of all your Exclusive Highlight.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="bg-orange-500 text-white rounded-tl-lg">Media</TableHead>
            <TableHead className="bg-orange-500 text-white">Title</TableHead>
            <TableHead className="bg-orange-500 text-white">Subtitle</TableHead>
            <TableHead className="bg-orange-500 text-white">Category</TableHead>
            <TableHead className="bg-orange-500 text-white rounded-tr-lg">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promotion) => {
            const { id: id, title, media } = promotion;
            return (
              <TableRow key={promotion.id}>
                <TableCell>
                  <img
                    src={media}
                    alt={title}
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{promotion.title}</TableCell>
                <TableCell>{promotion.subtitle}</TableCell>
                <TableCell>{promotion.category}</TableCell>
                <TableCell className="flex items-center gap-x-2">
                  <Link href={`/promotions/${promotion.id}/edit`}>
                    <IconButton actionType="edit" />
                  </Link>
                  <DeletePromotion promotionId={promotion.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DeletePromotion({ promotionId }: { promotionId: string }) {
  const deletePromotion = deletePromotionAction.bind(null, { promotionId });
  return (
    <form action={deletePromotion}>
      <IconButton type="submit" actionType="delete" />
    </form>
  );
}

export default ExclusiveHighlighPage;