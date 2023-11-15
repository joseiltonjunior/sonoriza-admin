import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import ReactLoading from 'react-loading'
import colors from 'tailwindcss/colors'

interface ButtonProps extends ComponentProps<'button'> {
  title: string
  variant?: 'green' | 'dark' | 'blue' | 'outline' | 'red' | 'purple'
  isLoading?: boolean
}

export function Button({
  title,
  variant = 'blue',
  className,
  isLoading,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      data-variant={variant}
      className={twMerge(
        `rounded text-sm text-white font-bold p-2 w-full h-fit data-[variant=green]:button-green data-[variant=blue]:button-blue data-[variant=dark]:button-blue-dark data-[variant=red]:button-red data-[variant=purple]:button-purple data-[variant=outline]:button-outline disabled:bg-gray-300 disabled:hover:bg-gray-300/90`,
        className,
      )}
      {...rest}
    >
      {isLoading ? (
        <ReactLoading
          data-variant={variant}
          className="loading ml-auto mr-auto"
          type="bars"
          color={variant === 'outline' ? colors.purple[600] : '#fff'}
          width={20}
          height={20}
        />
      ) : (
        title
      )}
    </button>
  )
}
