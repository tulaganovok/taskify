import { TextareaHTMLAttributes, Ref } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Textarea } from '../ui/textarea'

interface TextareaFieldProps<
  T extends FieldValues,
> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  ref?: Ref<HTMLTextAreaElement | null>
  hiddenErrorMessage?: boolean
}

export default function TextareaField<T extends FieldValues>({
  name,
  control,
  label,
  ref,
  hiddenErrorMessage,
  ...props
}: TextareaFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          <Textarea
            {...field}
            ref={ref}
            id={field.name}
            aria-invalid={fieldState.invalid}
            {...props}
          />

          {!hiddenErrorMessage && fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
