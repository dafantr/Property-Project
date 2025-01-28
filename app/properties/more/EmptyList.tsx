import { Button } from '@/components/ui/button';

function EmptyList({
  heading = 'No items in the list.',
  message = 'Keep exploring our properties.',
  btnText = 'Clear Filters',
}: {
  heading?: string;
  message?: string;
  btnText?: string;
}) {
  const handleRefreshPage = () => {
    window.location.reload(); // This will reload the current page
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold ">{heading}</h2>
      <p className="text-lg">{message}</p>
      <Button className="mt-4 capitalize" size="lg" onClick={handleRefreshPage}>
        {btnText}
      </Button>
    </div>
  );
}

export default EmptyList;
