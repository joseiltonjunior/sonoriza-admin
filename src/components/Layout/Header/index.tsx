import logo from '@/assets/logo.png'

import { useFloatMenu } from '@/hooks/useFloatMenu'
import { ReduxProps } from '@/storage'
import { AdminDataProps } from '@/storage/modules/admin/reducer'

import { IoPerson } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'

interface HeaderProps {
  isError?: boolean
}

export function Header({ isError }: HeaderProps) {
  const { isVisible, show } = useFloatMenu()

  const { admin } = useSelector<ReduxProps, AdminDataProps>(
    (state) => state.admin,
  )

  return (
    <div className="h-20 flex items-center justify-between bg-gray-700 py-5 px-10 shadow-black/10 shadow-xl w-full z-50 fixed">
      <img src={logo} alt="logo" className="w-32" />

      {!isError && (
        <button
          className="w-12 h-12 bg-purple-600 items-center flex justify-center cursor-pointer rounded-full overflow-hidden"
          onClick={() => {
            show(!isVisible)
          }}
        >
          {admin.photoURL ? (
            <img src={admin.photoURL} alt="user pic" />
          ) : (
            <IoPerson color={colors.gray[200]} />
          )}
        </button>
      )}
    </div>
  )
}
