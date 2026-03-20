import { useFloatMenu } from '@/hooks/useFloatMenu'
import { useModal } from '@/hooks/useModal'
import { useNavigate } from 'react-router-dom'

import { logoutCurrentSession } from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { clearClientSession, getRefreshToken } from '@/services/authStorage'

export function FloatMenu() {
  const { isVisible, show } = useFloatMenu()
  const { openModal } = useModal()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSignOut = async () => {
    const refreshToken = getRefreshToken()

    try {
      if (refreshToken) {
        await logoutCurrentSession(refreshToken)
      }
    } catch (error) {
      showToast('Error logout user', {
        type: 'error',
        theme: 'colored',
      })
    } finally {
      clearClientSession()
      navigate('/', { replace: true })
    }
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
