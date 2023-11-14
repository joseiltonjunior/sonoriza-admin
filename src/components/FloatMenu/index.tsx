import { useFloatMenu } from '@/hooks/useFloatMenu'
import { useModal } from '@/hooks/useModal'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { useDispatch } from 'react-redux'
import { handleSetArtists } from '@/storage/modules/artists/reducer'
import { handleTrackListRemote } from '@/storage/modules/trackListRemote/reducer'
import { handleSetMusicalGenres } from '@/storage/modules/musicalGenres/reducer'

export function FloatMenu() {
  const { isVisible, show } = useFloatMenu()
  const { openModal } = useModal()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignOut = async () => {
    dispatch(handleSetArtists({ artists: [] }))
    dispatch(handleTrackListRemote({ trackListRemote: [] }))
    dispatch(handleSetMusicalGenres({ musicalGenres: [] }))
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
