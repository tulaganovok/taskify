import { z } from 'zod'
import {
  boardTitleFormSchema,
  cardDescriptionFormSchema,
  cardFormSchema,
  cardTitleFormSchema,
  createBoardFormSchema,
  listFormSchema,
  listTitleFormSchema,
} from './validations'
import { Card, List } from '@/generated/prisma/client'

export interface Organization {
  id: string
  name: string
  imageUrl: string
}

export type CreateBoardFormSchema = z.infer<typeof createBoardFormSchema>
export type BoardTitleFormSchema = z.infer<typeof boardTitleFormSchema>
export type ListFormSchema = z.infer<typeof listFormSchema>
export type ListTitleFormSchema = z.infer<typeof listTitleFormSchema>
export type CardFormSchema = z.infer<typeof cardFormSchema>
export type CardTitleFormSchema = z.infer<typeof cardTitleFormSchema>

export type CardDescriptionFormSchema = z.infer<typeof cardDescriptionFormSchema>

export type ListWithCards = List & { cards: Card[] }
export type CardWithList = Card & { list: List }

export type AuditLogClient = {
  action: 'Create' | 'Update' | 'Delete'
  entityTitle: string
  entityType: string
}
