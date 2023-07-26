import { ChangeEvent } from 'react'
import arrow from '@/assets/arrow-strong.svg'

interface Option {
  value: string
  label: string
}

interface SelectWithIconProps {
  options: Option[]
  value: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  placeholder?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
}: SelectWithIconProps) {
  return (
    <div className="relative inline-block w-full">
      <select
        value={value}
        onChange={onChange}
        className="block appearance-none w-full bg-white border border-gray-300 rounded px-4 py-2 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
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
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-gray-700">
        <img src={arrow} alt="arrow" />
      </div>
    </div>
  )
}
