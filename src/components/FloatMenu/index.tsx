import { useFloatMenu } from '@/hooks/useFloatMenu'
import { useModal } from '@/hooks/useModal'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@/services/firebase'

export function FloatMenu() {
  const { isVisible, show } = useFloatMenu()
  const { openModal } = useModal()
  const navigate = useNavigate()

  return (
    <div
      className={`${
        isVisible ? 'visible' : 'hidden'
      } fixed r-0 w-40 z-10 mt-24 right-10 md:right-5 bg-white rounded-md overflow-hidden`}
    >
      <button
        onClick={() => show(false)}
        className="cursor-pointer w-full p-3 text-base font-bold hover:bg-slate-50"
      >
        Fechar
      </button>
      <button
        className="cursor-pointer w-full p-3 text-base font-bold hover:bg-slate-50 border-t"
        onClick={() => {
          show(false)
          openModal({
            title: 'Já vai !?',
            textConfirm: 'Sair',
            confirm() {
              signOut(auth)
              navigate('/')
            },
            description: 'Você realmente deseja sair?',
          })
        }}
      >
        Sair
      </button>
    </div>
  )
}
