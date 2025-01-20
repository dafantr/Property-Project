import { fetchMemberById } from '@/utils/actions'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import EditMemberForm from '@/app/cms/components/EditMemberForm'

export default async function EditMemberPage({
  params,
}: {
  params: { id: string }
}) {
  const member = await fetchMemberById(params.id)
  if (!member) redirect('/cms')

  const citizenshipOptions = await fetchCitizenshipOptions()

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/cms"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Members
        </Link>
        <h1 className="text-2xl font-bold">Edit Member</h1>
      </div>

      <EditMemberForm
        member={member}
        citizenshipOptions={citizenshipOptions}
      />
    </main>
  )
}

async function fetchCitizenshipOptions() {
  const response = await fetch("https://countriesnow.space/api/v0.1/countries")
  const data = await response.json()
  return data.data.map((item: { country: string, iso2: string }) => ({
    value: item.iso2,
    label: item.country,
  }))
}