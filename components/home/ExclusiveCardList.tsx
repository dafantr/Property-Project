import ExclusiveCard from '../card/ExclusiveCard';
import type { ExclusiveCardProps } from '@/utils/types';
import Link from 'next/link';

function ExclusiveCardList({ exclusives }: { exclusives: ExclusiveCardProps[]; }) {
    return (
        <div>
            <section className="mt-4 gap-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {exclusives.map((promotion) => (
                    <ExclusiveCard key={promotion.id} promotion={promotion} />
                ))}
            </section>


        </div>
    );
}

export default ExclusiveCardList;
