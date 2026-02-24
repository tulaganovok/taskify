import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AuditLogClient, Organization } from './types'
import { Activity, CreditCard, Layout, Settings } from 'lucide-react'
import { startCase } from 'lodash'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNavItemRoutes(organization: Organization) {
  return [
    {
      label: 'Boards',
      icon: Layout,
      href: `/organization/${organization.id}`,
    },
    {
      label: 'Activity',
      icon: Activity,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: 'Settings',
      icon: Settings,
      href: `/organization/${organization.id}/settings`,
    },
    {
      label: 'Billing',
      icon: CreditCard,
      href: `/organization/${organization.id}/billing`,
    },
  ]
}

export function getTitleBySlug(slug: string) {
  const splittedSlug = slug.split('-')
  const titleSlug = splittedSlug?.slice(0, splittedSlug.length - 1).join('-')
  const title = startCase(titleSlug)
  return title
}

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export const fetcher = async (url: string) => {
  return fetch(url).then(res => res.json())
}

export function generateLogMessage(auditLog: AuditLogClient) {
  const { action, entityTitle, entityType } = auditLog

  switch (action) {
    case 'Create':
      return ` created ${entityType.toLowerCase()} "${entityTitle}"`
    case 'Update':
      return ` updated ${entityType.toLowerCase()} "${entityTitle}"`
    case 'Delete':
      return ` deleted ${entityType.toLowerCase()} "${entityTitle}"`
    default:
      return ` unknown action ${entityType.toLowerCase()} "${entityTitle}"`
  }
}

export function getAbsoluteUrl(relativeUrl: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${relativeUrl}`
}
