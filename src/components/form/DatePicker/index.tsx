import { ClientProps } from '@/types/client'
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
  setDefaultLocale,
} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FieldError, UseFormRegister } from 'react-hook-form'
import ptBR from 'date-fns/locale/pt-BR'
import MaskedInput from 'react-text-mask'
import { useRef } from 'react'

interface DatePickerProps extends ReactDatePickerProps {
  error?: FieldError
  name: string
  label: string
  register: UseFormRegister<ClientProps>
}

registerLocale('pt-BR', ptBR)
setDefaultLocale('pt-BR')

export function DatePickerCustom({
  label,
  name,
  error,
  register,
  ...rest
}: DatePickerProps) {
  const maxDate = new Date(2005, 11, 31)
  const mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]

  const datePickerRef = useRef(null)

  return (
    <div className="relative z-10">
      <h4 className="font-bold text-sm my-3">{label}</h4>
      <DatePicker
        {...register(name as keyof ClientProps)}
        ref={datePickerRef}
        autoComplete="none"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={80}
        maxDate={maxDate}
        customInput={<MaskedInput mask={mask} guide={false} />}
        dateFormat="dd/MM/yyyy"
        className={`w-full bg-white border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal ${
          !!error && 'border-red-600'
        }`}
        {...rest}
      />
    </div>
  )
}
