import { useFloatMenu } from '@/hooks/useFloatMenu'
import { useModal } from '@/hooks/useModal'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@/services/firebase'

export function FloatMenu() {
  const { isVisible, show } = useFloatMenu()
  const { openModal } = useModal()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/')
  }

  return (
    <div
      className={`${
        isVisible ? 'visible' : 'hidden'
      } fixed r-0 w-40 z-10 mt-24 right-10 md:right-5 bg-white rounded-md overflow-hidden`}
    >
      <button
        onClick={() => show(false)}
        className="cursor-pointer w-full p-3 font-semibold hover:bg-slate-50"
      >
        Close
      </button>
      <button
        className="cursor-pointer w-full p-3 font-semibold hover:bg-slate-50 border-t"
        onClick={() => {
          show(false)
          openModal({
            title: "It's going !?",
            textConfirm: 'Exit',
            confirm() {
              handleSignOut()
            },
            description: 'Do you really want to leave',
          })
        }}
      >
        Exit
      </button>
    </div>
  )
}
