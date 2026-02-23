import { CardWithList } from '@/lib/types'
import { AlignLeft } from 'lucide-react'
import { RefObject, useRef, useState } from 'react'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

interface CardDescriptionProps {
  card: CardWithList
}

export default function CardDescriptionForm({ card }: CardDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  const onKeyDown = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false)
    }
  }

  useEventListener('keydown', onKeyDown)
  useOnClickOutside(formRef as RefObject<HTMLElement>, () => setIsEditing(false))

  return (
    <div className='flex items-start gap-x-3 w-full'>
      <AlignLeft className='size-5 mt-0.5 text-accent-foreground' />

      <div className='w-full'>
        <p className='font-semibold text-accent-foreground mb-2'>Description</p>

        {isEditing ? (
          <form id='card-description-form' ref={formRef}></form>
        ) : (
          <div
            role='button'
            className='min-h-20 text-sm font-medium py-3 px-3.5 rounded-md bg-secondary'
          >
            {card.description || 'Add a more detailed description...'}
          </div>
        )}
      </div>

      {card.description}
    </div>
  )
}
