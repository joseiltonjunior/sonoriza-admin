import { ReduxProps } from '@/storage'
import { SideMenuProps, handleSetTag } from '@/storage/modules/sideMenu/reducer'
import { ComponentProps } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ComponentProps<'button'> {
  currentTag: 'musics' | 'artists' | 'genres' | 'users' | 'signUrl'
  title: string
}

export function Button({ currentTag, title, className, ...rest }: ButtonProps) {
  const dispatch = useDispatch()

  const { tag } = useSelector<ReduxProps, SideMenuProps>(
    (state) => state.sideMenu,
  )

  return (
    <button
      {...rest}
      onClick={() => {
        dispatch(handleSetTag({ tag: currentTag }))
      }}
      className={twMerge(
        `w-full font-bold py-2 px-6 rounded-xl  border border-purple-600 ${
          tag === currentTag
            ? 'bg-white text-purple-600 hover:bg-white/90'
            : 'bg-transparent text-white hover:bg-purple-600/90'
        }`,
        className,
      )}
    >
      {title}
    </button>
  )
}
