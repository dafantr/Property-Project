'use client';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

type ChartPropsType = {
    data: {
        date: string;
        count: number;
    }[];
};

function Chart({ data }: ChartPropsType) {
    return (
        <section className='mt-24'>
            <h1 className='text-4xl font-semibold text-center'>Monthly Bookings</h1>
            <ResponsiveContainer width='100%' height={300}>
                <BarChart data={data} margin={{ top: 50 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                        cursor={{ fill: 'transparent' }} // No hover background
                        contentStyle={{
                            backgroundColor: '#e0e0e0',  // Light gray background
                            border: 'none',               // Optional: Remove border
                            borderRadius: '8px',           // Optional: Add rounded corners
                        }}
                        labelStyle={{ color: '#333' }} // Optional: Darker text for better readability
                    />
                    <Bar dataKey='count' fill='#F97215' barSize={75} />
                </BarChart>
            </ResponsiveContainer>
        </section>
    );
}

export default Chart;
