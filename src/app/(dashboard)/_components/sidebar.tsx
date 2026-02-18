'use client'

import { Accordion } from '@/components/ui/accordion'
import { useOrganization, useOrganizationList } from '@clerk/nextjs'
import { useLocalStorage } from 'usehooks-ts'
import NavItem from './nav-item'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import SidebarSkeleton from './sidebar-skeleton'
import AddWorkspace from './add-workspace'

interface SidebarProps {
  storageKey?: string
}

export default function Sidebar({ storageKey = 't-sidebar-state' }: SidebarProps) {
  const [expanded, setExpanded] = useLocalStorage<Record<string, unknown>>(storageKey, {})
  const { organization: activeOrganization, isLoaded: isLoadedOrg, } = useOrganization()

  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: { infinite: true },
  })

  const pathname = usePathname()

  const defaultAccordionValue = Object.keys(expanded).reduce((acc: string[], key: string) => {
    if (expanded[key]) {
      acc.push(key)
    }

    return acc
  }, [])

  const onExpand = (id: string) => {
    setExpanded(cur => ({ ...cur, [id]: !expanded[id] }))
  }

  useEffect(() => {
    const revalidateUserMemberships = userMemberships.revalidate

    if (revalidateUserMemberships) {
      userMemberships.revalidate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading)
    return <SidebarSkeleton />


  return (
    <>
      <div className='font-medium text-sm flex items-center mb-1'>
        <span className='text-muted-foreground'>Workspaces</span>
        <AddWorkspace />
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

