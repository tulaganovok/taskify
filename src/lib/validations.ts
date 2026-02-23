import { z } from 'zod'

export const createBoardFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(32, 'Title must be less than 32 characters'),
  image: z.string().min(3, 'Wallpaper is required'),
})

export const boardTitleFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(32, 'Title must be less than 32 characters'),
})

export const listFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(32, 'Name must be less than 32 characters'),
})

export const listTitleFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(32, 'Name must be less than 32 characters'),
})

export const cardFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(128, 'Name must be less than 128 characters'),
})

export const cardTitleFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(128, 'Name must be less than 128 characters'),
})
