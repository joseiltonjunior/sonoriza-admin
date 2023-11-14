import { auth } from '@/services/firebase'

import { useEffect, useState } from 'react'

import { Button } from './Button'

interface AsideProps {
  isError?: boolean
}

export function Aside({ isError }: AsideProps) {
  const [isUser, setIsUser] = useState(false)

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
      {!isError && isUser && (
        <>
          <div className="flex flex-col gap-4 px-10 pt-4">
            <Button currentTag="musics" />
            <Button currentTag="artists" />
            <Button currentTag="genres" />
            <Button currentTag="users" />
          </div>
        </>
      )}
    </div>
  )
}
