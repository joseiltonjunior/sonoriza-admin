import { ClientProps } from '@/types/client'

import { ComponentProps } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'
import MaskedInput from 'react-text-mask'

type InputMask = string | RegExp
interface InputProps extends ComponentProps<'input'> {
  error?: FieldError
  name: string
  placeholder?: string
  label: string

  register: UseFormRegister<ClientProps>
  mask?: InputMask[]
}

export function Input({
  label,
  error,
  register,
  placeholder,
  name,
  mask,
  onChange,
  ...rest
}: InputProps) {
  return (
    <div>
      <h4 className="font-bold text-sm my-3">{label}</h4>
      {mask ? (
        <MaskedInput
          {...rest}
          {...register(name as keyof ClientProps)}
          mask={mask}
          onChange={onChange}
          guide={false}
          data-is-error={!!error}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal data-[is-error=true]:border-red-600"
        />
      ) : (
        <input
          {...register(name as keyof ClientProps)}
          data-is-error={!!error}
          placeholder={placeholder}
          type="text"
          className="w-full bg-white border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal data-[is-error=true]:border-red-600"
          {...rest}
        />
      )}
    </div>
  )
}
