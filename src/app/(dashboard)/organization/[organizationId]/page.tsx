import { Separator } from '@/components/ui/separator'
import OrgInfo from './_components/org-info'
import BoardList from './_components/board-list'

export default function OrganizationIdPage() {
  return (
    <div className='w-full mb-20'>
      <OrgInfo />
      <Separator className='my-4' />

      <div className='px-2 md:px-4'>
        <BoardList />
      </div>
    </div>
  )
}
