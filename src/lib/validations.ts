import { z } from 'zod';

export const createBoardFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(32, 'Title must be less than 32 characters'),
  image: z.string().min(3, 'Wallpaper is required'),
});
