import { Button } from '@/components/ui/button';

interface EmptyListProps {
  heading?: string;
  message?: string;
  btnText?: string;
  onButtonClick?: () => void; // ✅ Fix: Accept `onButtonClick` as a prop
}

function EmptyList({
  heading = 'No items in the list.',
  message = 'Keep exploring our properties.',
  btnText = 'Clear Filters',
  onButtonClick, // ✅ Use onButtonClick prop
}: EmptyListProps) {
  
  return (
    <div className="mt-4 text-center">
      <h2 className="text-xl font-bold">{heading}</h2>
      <p className="text-lg">{message}</p>
      <Button 
        className="mt-4 capitalize" 
        size="lg" 
        onClick={onButtonClick || (() => window.location.reload())} // ✅ Use `onButtonClick` or fallback to page refresh
      >
        {btnText}
      </Button>
    </div>
  );
}

export default EmptyList;