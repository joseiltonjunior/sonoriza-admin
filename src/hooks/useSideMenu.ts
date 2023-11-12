import { useState } from 'react'

interface tagProps {
  tag: 'musics' | 'artists' | 'genres'
}

export function useSideMenu() {
  const [tag, setTag] = useState<tagProps>({ tag: 'musics' })

  const handleSetTag = (currentTag: tagProps) => {
    setTag(currentTag)
  }

  return { tag, handleSetTag }
}
