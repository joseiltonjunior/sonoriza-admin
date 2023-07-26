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
  ...rest
}: ButtonProps) {
  return (
    <button
      data-variant={variant}
      className={twMerge(
        `rounded text-sm text-white font-bold p-2 w-full h-fit data-[variant=green]:button-green data-[variant=blue]:button-blue data-[variant=dark]:button-blue-dark data-[variant=outline]:button-outline`,
        className,
      )}
      {...rest}
    >
      {title}
    </button>
  )
}
