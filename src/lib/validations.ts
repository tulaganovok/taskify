import { z } from 'zod'

export const createBoardFormSchema = z.object({
  title: z.string().min(3),
  image: z.string().min(3),
})
