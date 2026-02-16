import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Organization } from './types'
import { Activity, CreditCard, Layout, Settings } from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNavItemRoutes(organization: Organization) {
  return [
    { label: 'Boards', icon: Layout, href: `/organization/${organization.id}` },
    { label: 'Activity', icon: Activity, href: `/organization/${organization.id}/activity` },
    { label: 'Settings', icon: Settings, href: `/organization/${organization.id}/settings` },
    { label: 'Billing', icon: CreditCard, href: `/organization/${organization.id}/billing` },
  ]
}
