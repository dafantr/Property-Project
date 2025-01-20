import { fetchMemberAll } from '@/utils/actions'
import { MemberList } from './components/MemberList'

export default async function CMSPage() {
  const members = await fetchMemberAll();

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Member Management</h1>
      </div>

      <MemberList initialMembers={members} />
    </main>
  )
}
