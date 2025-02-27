'use client'

import { Button } from '@/components/ui/button'
import { Edit, Eye, Trash2, RefreshCw, Undo2, Users, X } from 'lucide-react'
import Link from 'next/link'
import { clearMemberPointsAndCommission, deleteMember, makeMarketingMember, removeMarketingMember, undoDeleteMember } from '@/utils/actions'
import { useToast } from '@/components/ui/use-toast'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface MemberActionsProps {
  member: any;
  tierList: any[];
}

export function MemberActions({ member, tierList }: MemberActionsProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter();

  const memberId = member.id;
  const isDeleted = member.isDeleted === 1 ? true : false;

  const handleClear = () => {
    if (confirm('Are you sure you want to reset the points and commission of this member?')) {
      startTransition(async () => {
        const result = await clearMemberPointsAndCommission(memberId)
        toast({
        title: result.message,
        variant: result.message.includes('error') ? 'destructive' : 'default',
        })
        router.refresh();
      })
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this member?')) {
      startTransition(async () => {
        const result = await deleteMember(memberId)
        toast({
          title: result.message,
          variant: result.message.includes('error') ? 'destructive' : 'default',
        })
        router.refresh();
      })
    }
  }

  const handleUndoDelete = () => {
    if (confirm('Are you sure you want to undo delete this member?')) {
      startTransition(async () => {
        const result = await undoDeleteMember(memberId)
        toast({
          title: result.message,
          variant: result.message.includes('error') ? 'destructive' : 'default',
        })
        router.refresh();
      })
    }
  }

  const handleUpdateToMarketingMember = () => {
    if (confirm('Are you sure you want to make this member a marketing member?')) {
      startTransition(async () => {
        const result = await makeMarketingMember(memberId)
        toast({
          title: result.message,
          variant: result.message.includes('error') ? 'destructive' : 'default',
        })
        router.refresh();
      })
    }
  }

  const handleRemoveMarketingMember = () => {
    if (confirm('Are you sure you want to remove this member from marketing member?')) {
      startTransition(async () => {
        const result = await removeMarketingMember(memberId)
        toast({
          title: result.message,
          variant: result.message.includes('error') ? 'destructive' : 'default',
        })
        router.refresh();
      })
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        asChild
        className="h-8 w-8"
      >
        <Link href={`/admin/memberOverview/members/${memberId}`}>
          <Eye className="h-3.5 w-3.5" />
        </Link>
      </Button>
      {isDeleted ? (
      <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 opacity-50 cursor-not-allowed"
          disabled
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          asChild
          className="h-8 w-8"
        >
          <Link href={`/admin/memberOverview/members/${memberId}/edit`}>
            <Edit className="h-3.5 w-3.5" />
          </Link>
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleClear}
        disabled={isPending || isDeleted}
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>
      {member.isMarketing ? (
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleRemoveMarketingMember}
        disabled={isPending || isDeleted}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
      ) : (
        <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleUpdateToMarketingMember}
        disabled={isPending || isDeleted}
      >
        <Users className="h-3.5 w-3.5" />
      </Button>
      )}

      {isDeleted ? (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleUndoDelete}
          disabled={isPending || !isDeleted}
        >
          <Undo2 className="h-3.5 w-3.5" />
        </Button>
      ) : (
      <Button
        variant="destructive"
        size="icon"
        className="h-8 w-8"
        onClick={handleDelete}
        disabled={isPending || isDeleted}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      )}
    </div>
  )
}