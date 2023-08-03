import logo from '@/assets/logo.png'
import bell from '@/assets/bell.svg'
import user from '@/assets/user.svg'
import { Button } from './Button'

interface HeaderProps {
  isError?: boolean
}

export function Header({ isError }: HeaderProps) {
  return (
    <div className="h-20 flex items-center justify-between bg-white py-5 px-10 shadow-black/10 shadow-xl w-full z-50 fixed">
      <img src={logo} alt="logo" className="w-32" />

      {!isError && (
        <div className="flex gap-6">
          <Button icon={bell} />
          <Button icon={user} />
        </div>
      )}
    </div>
  )
}
