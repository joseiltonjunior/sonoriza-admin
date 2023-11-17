import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'

import { AdminProps } from '@/storage/modules/admin/reducer'
import { useState } from 'react'
import { IoLogoFirebase } from 'react-icons/io5'
import { SideMenuProps, handleSetTag } from '@/storage/modules/sideMenu/reducer'

interface AsideProps {
  isError?: boolean
}

export function Aside({ isError }: AsideProps) {
  const [firebaseIsVisible, setFirebaseIsVisible] = useState(true)
  // const [awsIsVisible, setAwsIsVisible] = useState(false)

  const dispatch = useDispatch()

  const { admin } = useSelector<ReduxProps, AdminProps>((state) => state.admin)

  const { tag } = useSelector<ReduxProps, SideMenuProps>(
    (state) => state.sideMenu,
  )

  return (
    <div className="bg-gray-700 w-[350px] h-screen fixed base:hidden">
      {!isError && admin.uid && (
        <>
          <div className="flex flex-col px-10 pt-10">
            <button
              className={`text-white font-bold text-lg flex items-center justify-between hover:bg-purple-600 p-2 px-4 rounded-xl transition delay-75 ${
                firebaseIsVisible && `bg-purple-600 text-white rounded-b-none`
              }`}
              onClick={() => setFirebaseIsVisible(!firebaseIsVisible)}
            >
              Firestore DB
              <IoLogoFirebase />
            </button>
            {firebaseIsVisible && (
              <div className="flex-col flex items-start bg-white rounded-b-xl overflow-hidden">
                <button
                  className={`hover:bg-gray-100 w-full text-left p-2 font-medium pl-4 ${
                    tag === 'artists' && 'bg-gray-100'
                  }`}
                  onClick={() => dispatch(handleSetTag({ tag: 'artists' }))}
                >
                  Artists
                </button>
                <button
                  className={`hover:bg-gray-100 w-full text-left p-2 font-medium pl-4 ${
                    tag === 'genres' && 'bg-gray-100'
                  }`}
                  onClick={() => dispatch(handleSetTag({ tag: 'genres' }))}
                >
                  Musical Genres
                </button>
                <button
                  className={`hover:bg-gray-100 w-full text-left p-2 font-medium pl-4 ${
                    tag === 'musics' && 'bg-gray-100'
                  }`}
                  onClick={() => dispatch(handleSetTag({ tag: 'musics' }))}
                >
                  Musics
                </button>
                <button
                  className={`hover:bg-gray-100 w-full text-left p-2 font-medium pl-4 ${
                    tag === 'users' && 'bg-gray-100'
                  }`}
                  onClick={() => dispatch(handleSetTag({ tag: 'users' }))}
                >
                  Users
                </button>
              </div>
            )}

            {/* <button
              className={`text-white font-bold text-lg flex items-center justify-between hover:bg-purple-600 p-2 px-4 rounded-xl transition delay-75 ${
                awsIsVisible && `bg-purple-600 text-white rounded-b-none`
              } mt-8`}
              onClick={() => setAwsIsVisible(!awsIsVisible)}
              disabled
              title="Disabled"
            >
              AWS options
              <IoLogoAmazon />
            </button> */}
            {/* {awsIsVisible && (
              <div className="flex-col flex items-start bg-white rounded-b-xl overflow-hidden">
                <button
                  className={`hover:bg-gray-100 w-full text-left p-2 font-medium pl-4 ${
                    tag === 'signUrl' && 'bg-gray-100'
                  }`}
                  onClick={() => dispatch(handleSetTag({ tag: 'signUrl' }))}
                >
                  Sign CloudFront URL
                </button>
              </div>
            )} */}
          </div>
        </>
      )}
    </div>
  )
}
