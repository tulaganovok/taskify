import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form'
import { InputHTMLAttributes, Ref } from 'react'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { PasswordInput } from '../ui/password-input'
import { Input } from '../ui/input'

interface InputFieldProps<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  ref?: Ref<HTMLInputElement | null>
  hiddenErrorMessage?: boolean
}

export default function InputField<T extends FieldValues>({
  name,
  control,
  ref,
  label = '',
  hiddenErrorMessage = false,
  ...props
}: InputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          {props.type === 'password' ? (
            <PasswordInput
              {...field}
              ref={ref}
              id={field.name}
              aria-invalid={fieldState.invalid}
              {...props}
            />
          ) : (
            <Input
              {...field}
              ref={ref}
              id={field.name}
              aria-invalid={fieldState.invalid}
              {...props}
            />
          )}

          {!hiddenErrorMessage && fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
