import { ComponentProps } from 'react'
import arrow from '@/assets/arrow-strong.svg'
import { FieldError, UseFormRegister } from 'react-hook-form'
import { ClientProps } from '@/types/client'
import Skeleton from 'react-loading-skeleton'
import { Option } from '@/types/optionSelect'

interface SelectProps extends ComponentProps<'select'> {
  options?: Option[]
  name?: string
  error?: FieldError
  label: string
  register?: UseFormRegister<ClientProps>
  isLoading?: boolean
}

export function Select({
  options,
  label,
  value,
  name,
  error,
  onChange,
  isLoading,
  register,
  placeholder,
}: SelectProps) {
  return (
    <div>
      <h4 className="font-bold text-sm my-3">{label}</h4>
      {isLoading || !options ? (
        <Skeleton height={38} className="z-10" />
      ) : (
        <div className="relative inline-block w-full">
          {register ? (
            <select
              data-is-error={!!error}
              {...register(name as keyof ClientProps)}
              value={value}
              onChange={onChange}
              className="block appearance-none w-full bg-white border border-gray-300 rounded px-4 py-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer data-[is-error=true]:border-red-600"
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <select
              data-is-error={!!error}
              value={value}
              onChange={onChange}
              className="block appearance-none w-full bg-white border border-gray-300 rounded px-4 py-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer data-[is-error=true]:border-red-600"
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-gray-700">
            <img src={arrow} alt="arrow" />
          </div>
        </div>
      )}
    </div>
  )
}
