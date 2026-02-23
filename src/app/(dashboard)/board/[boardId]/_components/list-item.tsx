import { ListWithCards } from '@/lib/types'
import ListTitleForm from '@/components/forms/list-title.form'
import { useState } from 'react'
import CardForm from '@/components/forms/card.form'
import { cn } from '@/lib/utils'
import CardItem from './card-item'
import { Draggable, Droppable } from '@hello-pangea/dnd'

interface ListItemProps {
  index: number
  list: ListWithCards
}

export default function ListItem({ list, index }: ListItemProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Draggable draggableId={list.id} index={index}>
      {provided => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className='shrink-0 h-full w-72 select-none'
        >
          <div
            {...provided.dragHandleProps}
            className='w-full rounded-xl bg-background shadow-md pb-2'
          >
            <ListTitleForm list={list} onAddCard={() => setIsEditing(true)} />

            <Droppable droppableId={list.id} type='card'>
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    'px-1 mx-1 mt-1',
                    list.cards.length > 0 && 'overflow-y-auto max-h-120',
                  )}
                >
                  <div
                    className={cn(
                      'flex flex-col gap-y-2 mb-2',
                      list.cards.length === 0 && 'hidden',
                    )}
                  >
                    {list.cards.map((card, index) => (
                      <CardItem key={card.id} index={index} card={card} />
                    ))}
                  </div>

                  {provided.placeholder}

                  <CardForm
                    listId={list.id}
                    isEditing={isEditing}
                    enableEditing={() => setIsEditing(true)}
                    disableEditing={() => setIsEditing(false)}
                  />
                </div>
              )}
            </Droppable>
          </div>
        </li>
      )}
    </Draggable>
  )
}
