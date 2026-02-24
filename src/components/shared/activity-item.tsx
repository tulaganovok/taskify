import { AuditLog } from '@/generated/prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { format } from 'date-fns'
import { generateLogMessage } from '@/lib/utils'

interface ActivityItemProps {
  auditLog: AuditLog
}

export default function ActivityItem({ auditLog }: ActivityItemProps) {
  return (
    <li className='flex items-center gap-x-2'>
      <Avatar className='size-8'>
        <AvatarImage src={auditLog.userImage} alt={auditLog.userName} />
        <AvatarFallback className='uppercase'>{auditLog.userName.at(0)}</AvatarFallback>
      </Avatar>

      <div className='flex flex-col space-y-0.5'>
        <p className='text-sm text-muted-foreground'>
          <span className='font-semibold text-accent-foreground '>
            {auditLog.userName}
          </span>

          {generateLogMessage(auditLog)}
        </p>

        <p className='text-xs text-muted-foreground'>
          {format(new Date(auditLog.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  )
}
