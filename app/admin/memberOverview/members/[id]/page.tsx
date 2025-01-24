import { fetchMemberById } from '@/utils/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function MemberViewPage({
  params,
}: {
  params: { id: string }
}) {
  const member = await fetchMemberById(params.id)
  if (!member) return null

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/memberOverview"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Members
        </Link>
        <h1 className="text-2xl font-bold">Member Details</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {member.profile.firstName} {member.profile.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{member.profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{member.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize">{member.gender || 'N/A'}</p>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{member.address || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Member ID</p>
                <p className="font-medium">{member.memberId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Points</p>
                <p className="font-medium">{member.point}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Commission</p>
                <p className="font-medium">{formatCurrency(member.commission)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tier</p>
                <p className="font-medium">{member.tier.tierName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Parent ID</p>
                <p className="font-medium">{member.parentId || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Banking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bank Name</p>
                <p className="font-medium">{member.bankName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-medium">{member.bankAccNum || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Name</p>
                <p className="font-medium">{member.bankAccName || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}