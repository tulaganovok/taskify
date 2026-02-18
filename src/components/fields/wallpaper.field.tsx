/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils'
import { Check, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '../ui/input'
import { InputHTMLAttributes, useEffect, useState } from 'react'
import { defaultImages } from '@/lib/constants'
import { unsplash } from '@/lib/unsplash'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '../ui/field'

interface WallpaperFieldProps<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
}

export default function WallpaperField<T extends FieldValues>({
  name,
  control,
  label = '',
  disabled = false,
}: WallpaperFieldProps<T>) {
  const [images, setImages] = useState<Array<Record<string, any>>>(defaultImages)
  const [isFetchingImages, setIsFetchingImages] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      setIsFetchingImages(true)

      try {
        const result = await unsplash.photos.getRandom({ collectionIds: ['317099'], count: 9 })

        if (result && result.response) {
          const newImages = result.response as Array<Record<string, any>>
          setImages(newImages)
        } else {
          console.error('Failed to get images from Unsplash')
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsFetchingImages(false)
      }
    }

    fetchImages()
  }, [])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          {isFetchingImages ? (
            <div className='p-6 flex items-center justify-center'>
              <Loader2 className='size-6 text-primary animate-spin' />
            </div>
          ) : (
            <div className='relative'>
              <div className='grid grid-cols-3 gap-2'>
                {images.map(image => {
                  const value = `${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`
                  const isSelected = field.value?.startsWith(image.id)

                  return (
                    <div
                      key={image.id}
                      onClick={() => {
                        if (disabled) return
                        field.onChange(value)
                      }}
                      className={cn(
                        'cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted',
                        disabled && 'opacity-50 hover:opacity-50 cursor-auto',
                      )}
                    >
                      <Input
                        type='radio'
                        className='hidden'
                        checked={isSelected}
                        disabled={disabled}
                        value={value}
                        readOnly
                      />

                      <Image
                        src={image.urls.thumb}
                        alt='Unsplash Image'
                        fill
                        className='object-cover rounded-sm'
                      />

                      {isSelected && (
                        <div className='absolute inset-y-0 size-full bg-black/30 flex items-center justify-center'>
                          <Check className='size-4 text-white' />
                        </div>
                      )}

                      <Link
                        href={image.links.html}
                        target='_blank'
                        className='opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50'
                      >
                        {image.user.name}
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
