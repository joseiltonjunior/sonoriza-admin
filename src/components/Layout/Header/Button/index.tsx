import { ComponentProps } from 'react'

interface ButtonProps extends ComponentProps<'button'> {
  icon: string
}

export function Button({ icon, ...rest }: ButtonProps) {
  return (
    <button
      className="w-9 h-9 bg-gray-200 items-center flex justify-center rounded-full cursor-pointer"
      {...rest}
    >
      <img src={icon} alt="bell" />
    </button>
  )
}
