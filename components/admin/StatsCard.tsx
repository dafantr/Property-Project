import { Card, CardHeader } from '@/components/ui/card';

type StatsCardsProps = {
    title: string;
    value: number | string;
};

function StatsCards({ title, value }: StatsCardsProps) {
    return (
        <Card className="bg-muted p-4">
            <CardHeader className="flex flex-col items-start">
                <h3 className="capitalize text-2xl font-bold">{title}</h3>
                <span className="stat-value text-primary text-4xl font-extrabold">
                    {value}
                </span>
            </CardHeader>
        </Card>
    );
}

export default StatsCards;
