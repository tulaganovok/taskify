import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Organization } from '@/lib/types'
import { cn, getNavItemRoutes } from '@/lib/utils'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

interface NavItemProps {
  isExpanded: unknown
  isActive: boolean
  organization: Organization
  onExpand: (id: string) => void
}

export default function NavItem({ isExpanded, isActive, organization, onExpand }: NavItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const navItemRoutes = getNavItemRoutes(organization)

  return (
    <AccordionItem value={organization.id} className='border-none'>
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          'flex items-center gap-x-2 p-1.5 rounded-md transition no-underline hover:no-underline text-base hover:bg-accent/30',
          isActive &&
            !isExpanded &&
            'bg-primary/10 text-primary hover:text-primary hover:bg-primary/10',
        )}
      >
        <div className='flex items-center gap-x-2'>
          <div className='size-9 relative'>
            <Image
              src={organization.imageUrl}
              alt={organization.name}
              fill
              className='rounded-sm object-cover'
              sizes='(max-width: 768px) 100vw, 33vw'
            />
          </div>

          <span className='font-medium text-sm line-clamp-1'>
            {organization.name.length > 20
              ? `${organization.name.slice(0, 20)}...`
              : organization.name}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className='pt-1 text-accent-foreground pl-10'>
        {navItemRoutes.map(({ label, icon: Icon, href }, index) => (
          <Button
            key={index}
            size={'sm'}
            variant={'ghost'}
            onClick={() => router.push(href)}
            className={cn(
              'w-full font-normal justify-start mb-1 hover:bg-accent/30',
              href === pathname &&
                'bg-primary/10 text-primary hover:text-primary hover:bg-primary/10',
            )}
          >
            <Icon className='size-4 mr-1.5' />
            {label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}
