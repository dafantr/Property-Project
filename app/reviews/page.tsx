import EmptyList from '@/components/home/EmptyList';
import {
  deleteReviewAction,
  fetchPropertyReviewsByUser,
} from '@/utils/actions';
import ReviewCard from '@/components/reviews/ReviewCard';
import Title from '@/components/properties/Title';
import FormContainer from '@/components/form/FormContainer';
import { IconButton } from '@/components/form/Buttons';
import DeleteItemButton from '@/components/popupmessage/DeleteItemButton';

async function ReviewsPage() {
  const reviews = await fetchPropertyReviewsByUser();
  if (reviews.length === 0) return <EmptyList />;

  return (
    <>
      <Title text='Your Reviews' />
      <section className='grid md:grid-cols-2 gap-8 mt-4 '>
      {reviews.map((review) => {
          const { comment, rating } = review;
          const { name, image } = review.property;
          const reviewInfo = {
            comment,
            rating,
            name,
            image: Array.isArray(image) && image.length > 0 ? image[0] : '', // ✅ Use the first image or empty string
          };
          return (
            <ReviewCard key={review.id} reviewInfo={reviewInfo}>
              <DeleteItemButton itemId={review.id} itemType="review" />
            </ReviewCard>
          );
        })}
      </section>
    </>
  );
}

export default ReviewsPage;