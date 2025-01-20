'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { MemberActions } from './MemberActions'
import { useInView } from 'react-intersection-observer'

type Member = {
  id: string
  memberId: string
  profileId: string
  parentId: string | null
  point: number
  commission: number
  isActive: number
  profile: {
    firstName: string
    lastName: string
  }
  tier: {
    tierName: string
  }
}

interface MemberListProps {
  initialMembers: Member[]
}

export function MemberList({ initialMembers }: MemberListProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [displayedMembers, setDisplayedMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterActive, setFilterActive] = useState<string>('all')
  const [page, setPage] = useState(1)
  const itemsPerPage = 5

  const { ref, inView } = useInView()

  // Filter and sort members
  useEffect(() => {
    let filtered = [...initialMembers]

    // Search
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.parentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.tier.tierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.point.toString().includes(searchTerm) ||
        member.commission.toString().includes(searchTerm)
      )
    }

    // Filter by active status
    if (filterActive !== 'all') {
      filtered = filtered.filter(member =>
        filterActive === 'active' ? member.isActive === 1 : member.isActive === 0
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let compareA, compareB

      switch (sortField) {
        case 'name':
          compareA = `${a.profile.firstName} ${a.profile.lastName}`
          compareB = `${b.profile.firstName} ${b.profile.lastName}`
          break
        case 'points':
          compareA = a.point
          compareB = b.point
          break
        case 'commission':
          compareA = a.commission
          compareB = b.commission
          break
        default:
          compareA = a.memberId
          compareB = b.memberId
      }

      if (sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1
      } else {
        return compareA < compareB ? 1 : -1
      }
    })

    setMembers(filtered)
    setPage(1)
    setDisplayedMembers(filtered.slice(0, itemsPerPage))
  }, [searchTerm, sortField, sortOrder, filterActive, initialMembers])

  // Handle infinite scroll
  useEffect(() => {
    if (inView) {
      const nextItems = members.slice(0, (page + 1) * itemsPerPage)
      setDisplayedMembers(nextItems)
      setPage(page + 1)
    }
  }, [inView, members, page])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-[300px]"
        />
        <Select value={sortField} onValueChange={setSortField}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="points">Points</SelectItem>
            <SelectItem value="commission">Commission</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterActive} onValueChange={setFilterActive}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedMembers.map((member) => (
          <Card key={member.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="truncate">
                  {member.profile.firstName} {member.profile.lastName}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
                  member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Member ID</p>
                  <p className="font-medium truncate">{member.memberId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Parent ID</p>
                  <p className="font-medium truncate">{member.parentId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Points</p>
                  <p className="font-medium">{member.point}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Commission</p>
                  <p className="font-medium">
                    Rp {member.commission.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Tier</p>
                  <p className="font-medium">{member.tier.tierName}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t pt-4">
              <MemberActions memberId={member.id} />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Intersection Observer target */}
      {displayedMembers.length < members.length && (
        <div ref={ref} className="h-10" />
      )}
    </div>
  )
}