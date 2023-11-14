import logo from '@/assets/logo.png'

import { useFloatMenu } from '@/hooks/useFloatMenu'

import { IoPerson } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

interface HeaderProps {
  isError?: boolean
}

export function Header({ isError }: HeaderProps) {
  const { isVisible, show } = useFloatMenu()

  return (
    <div className="h-20 flex items-center justify-between bg-gray-700 py-5 px-10 shadow-black/10 shadow-xl w-full z-50 fixed">
      <img src={logo} alt="logo" className="w-32" />

      {!isError && (
        <div className="flex gap-6">
          <button
            className="w-9 h-9 bg-purple-600 items-center flex justify-center rounded-full cursor-pointer"
            onClick={() => {
              show(!isVisible)
            }}
          >
            <IoPerson color={colors.gray[200]} />
          </button>
        </div>
      )}
    </div>
  )
}
