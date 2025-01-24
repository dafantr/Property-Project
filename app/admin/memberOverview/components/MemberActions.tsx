'use client'

import { Button } from '@/components/ui/button'
import { Edit, Eye, Trash2, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { clearMemberPointsAndCommission, deleteMember } from '@/utils/actions'
import { useToast } from '@/components/ui/use-toast'
import { useTransition } from 'react'

interface MemberActionsProps {
  memberId: string
}

export function MemberActions({ memberId }: MemberActionsProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleClear = () => {
    startTransition(async () => {
      const result = await clearMemberPointsAndCommission(memberId)
      toast({
        title: result.message,
        variant: result.message.includes('error') ? 'destructive' : 'default',
      })
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this member?')) {
      startTransition(async () => {
        const result = await deleteMember(memberId)
        toast({
          title: result.message,
          variant: result.message.includes('error') ? 'destructive' : 'default',
        })
      })
    }
  }

  return (
    <div className="grid grid-cols-4 gap-2 w-full">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="w-full"
      >
        <Link href={`/cms/members/${memberId}`}>
          <Eye className="w-4 h-4 mr-1" />
          View
        </Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="w-full"
      >
        <Link href={`/cms/members/${memberId}/edit`}>
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleClear}
        disabled={isPending}
      >
        <RefreshCw className="w-4 h-4 mr-1" />
        Clear
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Delete
      </Button>
    </div>
  )
}