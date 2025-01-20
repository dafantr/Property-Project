import Image from 'next/image';
import Link from 'next/link';
import { ExclusiveCardProps } from '@/utils/types';

function ExclusiveCard({ promotion }: { promotion: ExclusiveCardProps }) {
    const { media, title, subtitle } = promotion;

    return (
        <article className="group relative bg-card text-card-foreground" key={promotion.id}>
            <Link href={`/promotions/${promotion.id}`}>
                <div className="relative h-[300px] mb-2 overflow-hidden rounded-md">
                    <Image
                        src={media}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                        className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="flex justify-center items-center">
                    <h3 className="text-sm font-semibold mt-1">{title}</h3>
                </div>
                <p className="text-justify text-sm mt-1 text-muted-foreground">
                    {subtitle.substring(0, 500)}
                </p>
            </Link>
        </article>
    );
}
export default ExclusiveCard;