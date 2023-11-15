import { twMerge } from 'tailwind-merge'
import { ComponentProps } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'
import MaskedInput from 'react-text-mask'

type InputMask = string | RegExp
interface InputProps extends ComponentProps<'input'> {
  error?: FieldError
  name: string
  placeholder?: string
  label: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  mask?: InputMask[]
}

export function Input({
  label,
  error,
  register,
  placeholder,
  className,
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
          {...register(name)}
          mask={mask}
          onChange={onChange}
          guide={false}
          data-is-error={!!error}
          placeholder={placeholder}
          className={twMerge(
            'w-full bg-white border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal data-[is-error=true]:border-red-600',
            className,
          )}
        />
      ) : (
        <input
          {...register(name)}
          data-is-error={!!error}
          placeholder={placeholder}
          type="text"
          className={twMerge(
            'w-full bg-white border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal data-[is-error=true]:border-red-600',
            className,
          )}
          {...rest}
        />
      )}
    </div>
  )
}
