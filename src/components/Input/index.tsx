import { ClientProps } from '@/types/client'
import { ComponentProps } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'
import InputMask from 'react-input-mask'

interface InputProps extends ComponentProps<'input'> {
  error?: FieldError
  name: string
  placeholder?: string
  label: string

  register: UseFormRegister<ClientProps>
  mask?: string
}

export function Input({
  label,
  error,
  register,
  placeholder,
  name,
  mask,
}: InputProps) {
  return (
    <div>
      <h4 className="font-bold text-sm my-3">{label}</h4>
      {mask ? (
        <InputMask
          data-is-error={!!error}
          {...register(name as keyof ClientProps)}
          mask={mask}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal data-[is-error=true]:border-red-600"
        />
      ) : (
        <input
          data-is-error={!!error}
          {...register(name as keyof ClientProps)}
          placeholder={placeholder}
          type="text"
          className="w-full bg-white border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal data-[is-error=true]:border-red-600"
        />
      )}
    </div>
  )
}
