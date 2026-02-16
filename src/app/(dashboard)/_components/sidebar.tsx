'use client'

import { Accordion } from '@/components/ui/accordion'

import { Skeleton } from '@/components/ui/skeleton'
import { useOrganization, useOrganizationList } from '@clerk/nextjs'
import { useLocalStorage } from 'usehooks-ts'
import NavItem from './nav-item'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface SidebarProps {
  storageKey?: string
}

export default function Sidebar({ storageKey = 't-sidebar-state' }: SidebarProps) {
  const [expanded, setExpanded] = useLocalStorage<Record<string, unknown>>(storageKey, {})
  const { organization: activeOrganization, isLoaded: isLoadedOrg } = useOrganization()

  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: { infinite: true },
  })

  const defaultAccordionValue = Object.keys(expanded).reduce((acc: string[], key: string) => {
    if (expanded[key]) {
      acc.push(key)
    }

    return acc
  }, [])

  const onExpand = (id: string) => {
    setExpanded(cur => ({ ...cur, [id]: !expanded[id] }))
  }

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading)
    return (
      <>
        <div className='flex items-center justify-between mb-2'>
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='size-4' />
        </div>
      </>
    )

  return (
    <>
      <div className='font-medium text-sm flex items-center mb-1'>
        <span className='text-muted-foreground'>Workspaces</span>

        <Button type='button' size={'icon-xs'} variant={'ghost'} className='ml-auto'>
          <Link href={'/create-org'}>
            <Plus className='size-4 text-muted-foreground' />
          </Link>
        </Button>
      </div>

      <Accordion
        type='multiple'
        defaultValue={defaultAccordionValue}
        className='space-y-2 max-h-[80vh] overflow-y-auto'
      >
        {userMemberships.data.map(({ organization }) => (
          <NavItem
            key={organization.id}
            isActive={organization.id === activeOrganization?.id}
            isExpanded={expanded[organization.id]}
            organization={organization}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </>
  )
}
