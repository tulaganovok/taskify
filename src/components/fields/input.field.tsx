import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form'
import { InputHTMLAttributes } from 'react'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { PasswordInput } from '../ui/password-input'
import { Input } from '../ui/input'

interface InputFieldProps<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
}

export default function InputField<T extends FieldValues>({
  name,
  control,
  label = '',
  placeholder = '',
  type = 'text',
  disabled = false,
  className = '',
  autoComplete,
}: InputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          {type === 'password' ? (
            <PasswordInput
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              disabled={disabled}
              className={className}
              autoComplete={autoComplete}
            />
          ) : (
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              disabled={disabled}
              className={className}
              autoComplete={autoComplete}
            />
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
