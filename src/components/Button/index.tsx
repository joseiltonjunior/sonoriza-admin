import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  button?: 'green' | 'dark' | 'blue'
}

export function Button({ title, button = 'blue', ...rest }: ButtonProps) {
  const colorClasses = {
    green: 'bg-green-400 hover:bg-green-400/90',
    dark: 'bg-blue-600 hover:bg-blue-600/90',
    blue: 'bg-blue-400 hover:bg-blue-400/90',
  }

  return (
    <button
      {...rest}
      className={`rounded text-sm text-white font-bold p-2 w-full ${colorClasses[button]}`}
    >
      {title}
    </button>
  )
}
