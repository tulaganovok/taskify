import { PropsWithChildren } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface HintProps extends PropsWithChildren {
  description: string
  side?: 'top' | 'left' | 'bottom' | 'right'
}

export default function Hint({ description, side = 'bottom', children }: HintProps) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      <TooltipContent side={side} sideOffset={0} className='text-xs max-w-48 wrap-break-word'>
        {description}
      </TooltipContent>
    </Tooltip>
  )
}
