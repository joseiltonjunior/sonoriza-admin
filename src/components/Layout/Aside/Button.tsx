import { ReduxProps } from '@/storage'
import { SideMenuProps, handleSetTag } from '@/storage/modules/sideMenu/reducer'

import { useDispatch, useSelector } from 'react-redux'

interface ButtonProps {
  currentTag: 'musics' | 'artists' | 'genres' | 'users'
  title: string
}

export function Button({ currentTag, title }: ButtonProps) {
  const dispatch = useDispatch()

  const { tag } = useSelector<ReduxProps, SideMenuProps>(
    (state) => state.sideMenu,
  )

  return (
    <button
      onClick={() => {
        dispatch(handleSetTag({ tag: currentTag }))
      }}
      className={`w-full font-bold py-2 px-6 rounded-xl  border border-purple-600 ${
        tag === currentTag
          ? 'bg-white text-purple-600 hover:bg-white/90'
          : 'bg-transparent text-white hover:bg-purple-600/90'
      }`}
    >
      {title}
    </button>
  )
}
