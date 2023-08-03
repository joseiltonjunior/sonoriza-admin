import { ClientProps } from '@/types/client'
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
  setDefaultLocale,
} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FieldError, UseFormRegister } from 'react-hook-form'
import ptBR from 'date-fns/locale/pt-BR'
import { getYear, getMonth } from 'date-fns'
import MaskedInput from 'react-text-mask'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import arrow from '@/assets/arrow-strong.svg'
import { Container } from './styles'

interface DatePickerProps extends ReactDatePickerProps {
  error?: FieldError
  name: string
  label: string
  register: UseFormRegister<ClientProps>
}

registerLocale('pt-BR', ptBR)
setDefaultLocale('pt-BR')

const range = (start: number, end: number, step: number = 1): number[] => {
  const length = Math.floor((end - start) / step) + 1
  return Array.from({ length }, (_, index) => start + index * step)
}

export function DatePickerCustom({
  label,
  name,
  error,
  register,
  ...rest
}: DatePickerProps) {
  const { t } = useTranslation()

  const maxDate = new Date(2005, 11, 31)
  const mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]

  const datePickerRef = useRef(null)

  const years = range(1920, 2005, 1)

  const months = [
    t('calendar.january'),
    t('calendar.february'),
    t('calendar.march'),
    t('calendar.april'),
    t('calendar.may'),
    t('calendar.june'),
    t('calendar.july'),
    t('calendar.august'),
    t('calendar.september'),
    t('calendar.october'),
    t('calendar.november'),
    t('calendar.december'),
  ]

  return (
    <Container className="relative z-20 flex flex-col">
      <h4 className="font-bold text-sm mb-3">{label}</h4>
      <DatePicker
        {...register(name as keyof ClientProps)}
        ref={datePickerRef}
        autoComplete="none"
        isClearable
        clearButtonClassName="pr-4"
        renderCustomHeader={({ date, changeYear, changeMonth }) => (
          <div className=" flex justify-between px-4 ">
            <div className="border-b border-gray-300 relative inline-block w-20">
              <select
                className="appearance-none bg-transparent w-full px-4 py-2 outline-none text-white font-semibold"
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(Number(value))}
              >
                {years.map((option) => (
                  <option key={option} value={option} className="text-gray-600">
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <img src={arrow} alt="arrow" />
              </div>
            </div>

            <div className="border-b border-gray-300 relative inline-block w-28">
              <select
                className="appearance-none bg-transparent w-full px-4 py-2 outline-none text-white font-semibold"
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map((option) => (
                  <option key={option} value={option} className="text-gray-600">
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <img src={arrow} alt="arrow" />
              </div>
            </div>
          </div>
        )}
        maxDate={maxDate}
        customInput={
          <MaskedInput
            mask={mask}
            guide={false}
            className={`w-[100%] border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal ${
              !!error && 'border-red-600'
            }`}
          />
        }
        dateFormat="dd/MM/yyyy"
        {...rest}
      ></DatePicker>
    </Container>
  )
}
