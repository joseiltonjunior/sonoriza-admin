import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ComponentProps<'button'> {
  title: string
  variant?: 'green' | 'dark' | 'blue' | 'outline'
}

export function Button({
  title,
  variant = 'blue',
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      data-variant={variant}
      className={twMerge(
        `rounded text-sm text-white font-bold p-2 w-full h-fit data-[variant=green]:button-green data-[variant=blue]:button-blue data-[variant=dark]:button-blue-dark data-[variant=outline]:button-outline disabled:bg-gray-300 disabled:hover:bg-gray-300/90`,
        className,
      )}
      {...rest}
    >
      {title}
    </button>
  )
}
