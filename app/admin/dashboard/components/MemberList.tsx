'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { member, profile, tier } from '@/utils/types'
import Link from 'next/link'

type Member = member & {
  profile: profile
  tier: tier
  joinDate: string
  parentId: string | null
}

interface MemberListProps {
  initialMembers: Member[]
}

export function MemberList({ initialMembers }: MemberListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [memberLevel, setMemberLevel] = useState('all')
  const [memberStatus, setMemberStatus] = useState('all')
  const [joinDate, setJoinDate] = useState('all')
  const [filteredMembers, setFilteredMembers] = useState(initialMembers)

  // Filter members
  useEffect(() => {
    let filtered = [...initialMembers]

    if (searchTerm) {
      filtered = filtered.filter(member =>
        `${member.profile.firstName} ${member.profile.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (memberLevel !== 'all') {
      filtered = filtered.filter(member => member.tier.tierLevel === parseInt(memberLevel))
    }

    if (memberStatus !== 'all') {
      filtered = filtered.filter(member =>
        memberStatus === 'active' ? member.isActive === 1 : member.isActive === 0
      )
    }

    // Add join date filtering if needed

    setFilteredMembers(filtered)
  }, [searchTerm, memberLevel, memberStatus, joinDate, initialMembers])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Member List</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-[300px]"
        />
        <Select value={memberLevel} onValueChange={setMemberLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Member Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="1">Level 1</SelectItem>
            <SelectItem value="2">Level 2</SelectItem>
          </SelectContent>
        </Select>
        <Select value={memberStatus} onValueChange={setMemberStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Member Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={joinDate} onValueChange={setJoinDate}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Join Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Member ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Upline ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Member Level</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Member Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Join Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3 text-sm">
                  {member.profile.firstName} {member.profile.lastName}
                </td>
                <td className="px-4 py-3 text-sm">{member.memberId}</td>
                <td className="px-4 py-3 text-sm">{member.parentId || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{member.tier.tierName}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{member.joinDate}</td>
                <td className="px-4 py-3 text-sm">
                  <Link
                    href={`/admin/memberOverview/members/${member.id}/edit`}
                    className="inline-block px-3 py-1 bg-[#B69C71] text-white rounded hover:bg-[#A08B60]"
                  >
                    View/Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}