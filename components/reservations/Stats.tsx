import StatsCards from '@/components/admin/StatsCard';
import { fetchReservationStats } from '@/utils/actions';
import { formatCurrency } from '@/utils/format';
async function Stats() {
  const stats = await fetchReservationStats();

  return (
    <div className='mt-8 grid md:grid-cols-2 gap-4 lg:grid-cols-3'>
      <StatsCards title='Total properties booked' value={stats.properties} />
      <StatsCards title='Total nights spend' value={stats.nights} />
      <StatsCards title='Total income' value={formatCurrency(stats.amount)} />
    </div>
  );
}
export default Stats;