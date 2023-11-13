import { auth } from '@/services/firebase'
import { ReduxProps } from '@/storage'
import { SideMenuProps, handleSetTag } from '@/storage/modules/sideMenu/reducer'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export function Aside() {
  const dispatch = useDispatch()

  const [isUser, setIsUser] = useState(false)

  const { tag } = useSelector<ReduxProps, SideMenuProps>(
    (state) => state.sideMenu,
  )

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.uid) {
        setIsUser(true)
        return
      }
      setIsUser(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="bg-gray-700 w-[350px] h-screen fixed base:hidden">
      {isUser && (
        <>
          <div className="flex flex-col gap-4 p-4">
            <button
              onClick={() => {
                dispatch(handleSetTag({ tag: 'musics' }))
              }}
              className={`w-full font-bold py-2 px-6 rounded-xl  border border-purple-600 ${
                tag === 'musics'
                  ? 'bg-white text-purple-600 hover:bg-white/90'
                  : 'bg-purple-600 text-white hover:bg-purple-600/90'
              }`}
            >
              Musics
            </button>
            <button
              onClick={() => {
                dispatch(handleSetTag({ tag: 'artists' }))
              }}
              className={`w-full font-bold py-2 px-6 rounded-xl  border border-purple-600 ${
                tag === 'artists'
                  ? 'bg-white text-purple-600 hover:bg-white/90'
                  : 'bg-purple-600 text-white hover:bg-purple-600/90'
              }`}
            >
              Artists
            </button>
            <button
              onClick={() => {
                dispatch(handleSetTag({ tag: 'genres' }))
              }}
              className={`w-full font-bold py-2 px-6 rounded-xl  border border-purple-600 ${
                tag === 'genres'
                  ? 'bg-white text-purple-600 hover:bg-white/90'
                  : 'bg-purple-600 text-white hover:bg-purple-600/90'
              }`}
            >
              Genres
            </button>

            <button
              onClick={() => {
                dispatch(handleSetTag({ tag: 'users' }))
              }}
              className={`w-full font-bold py-2 px-6 rounded-xl  border border-purple-600 ${
                tag === 'users'
                  ? 'bg-white text-purple-600 hover:bg-white/90'
                  : 'bg-purple-600 text-white hover:bg-purple-600/90'
              }`}
            >
              Users
            </button>
          </div>
        </>
      )}
    </div>
  )
}
