'use client'

import ListForm from '@/components/forms/list.form'
import { ListWithCards } from '@/lib/types'
import ListWrapper from './list-wrapper'
import { useEffect, useState } from 'react'
import ListItem from './list-item'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import { reorder } from '@/lib/utils'
import { updateListOrder } from '@/actions/list.action'
import { toast } from 'sonner'
import { updateCardOrder } from '@/actions/card.action'
import CardModal from '@/components/modals/card.modal'

interface ListContainerProps {
  boardId: string
  lists: ListWithCards[]
}

export default function ListContainer({ lists, boardId }: ListContainerProps) {
  const [orderedLists, setOrderedLists] = useState(lists)
  const [isDragging, setIsDragging] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOrderedLists(lists), [lists])

  const onDragEnd = (result: DropResult<string>) => {
    const { source, destination, type } = result

    if (isDragging) return
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    if (type === 'list') {
      const newOrderedLists = reorder(orderedLists, source.index, destination.index).map(
        (list, index) => ({ ...list, order: index }),
      )

      setOrderedLists(newOrderedLists)
      setIsDragging(true)

      const updateListOrderPromise = updateListOrder(newOrderedLists, boardId)

      toast.promise(updateListOrderPromise, {
        loading: 'Reordering lists...',
        success: 'Lists reordered successfully',
        error: 'Failed to reorder lists',
        finally: () => setIsDragging(false),
      })
    }

    if (type === 'card') {
      const newOrderedLists = [...orderedLists]

      const sourceList = newOrderedLists.find(list => list.id === source.droppableId)
      const destinationList = newOrderedLists.find(list => list.id === destination.droppableId)

      if (!sourceList || !destinationList) return

      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(sourceList.cards, source.index, destination.index)

        reorderedCards.forEach((card, index) => {
          card.order = index
        })

        sourceList.cards = reorderedCards

        setOrderedLists(newOrderedLists)
        setIsDragging(true)

        const updateCardOrderPromise = updateCardOrder(reorderedCards, boardId)

        toast.promise(updateCardOrderPromise, {
          loading: 'Reordering cards...',
          success: 'Cards reordered successfully',
          error: 'Failed to reorder cards',
          finally: () => setIsDragging(false),
        })
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1)
        movedCard.listId = destination.droppableId
        destinationList.cards.splice(destination.index, 0, movedCard)

        sourceList.cards.forEach((card, index) => {
          card.order = index
        })

        destinationList.cards.forEach((card, index) => {
          card.order = index
        })

        setOrderedLists(newOrderedLists)
        setIsDragging(true)

        const updateCardOrderPromise = updateCardOrder(destinationList.cards, boardId)

        toast.promise(updateCardOrderPromise, {
          loading: 'Reordering cards...',
          success: 'Cards reordered successfully',
          error: 'Failed to reorder cards',
          finally: () => setIsDragging(false),
        })
      }
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='lists' type='list' direction='horizontal'>
          {provided => (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='flex gap-x-4 h-full'
            >
              {orderedLists.map((list, index) => (
                <ListItem key={list.id} list={list} index={index} />
              ))}

              {provided.placeholder}

              <ListWrapper>
                <ListForm />
              </ListWrapper>

              <div className='flex shrink-0 w-1' />
            </ol>
          )}
        </Droppable>
      </DragDropContext>

      <CardModal />
    </>
  )
}
