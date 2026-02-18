import { z } from 'zod'
import { createBoardFormSchema } from './validations'

export interface Organization {
  id: string
  name: string
  imageUrl: string
}

export type CreateBoardFormSchema = z.infer<typeof createBoardFormSchema>
