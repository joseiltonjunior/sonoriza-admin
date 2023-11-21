import { PropsWithChildren } from 'react'
import { Header } from './Header'
import { Aside } from './Aside'
import { Modal } from '../Modal'
import { FloatMenu } from '../FloatMenu'
import sonorizaLogo from '@/assets/sonoriza-s.png'

interface LayoutProps extends PropsWithChildren {
  isError?: boolean
}

export function Layout({ children, isError }: LayoutProps) {
  return (
    <div className="relative">
      <Modal />
      <FloatMenu />
      <Header isError={isError} />
      <div className="pt-20 flex h-screen bg-gray-200 relative">
        <Aside isError={isError} />
        <main className="ml-[350px] w-screen py-10 px-10 md:py-10 md:px-5 base:ml-0">
          {children}
        </main>
        <button
          title="Go to top"
          onClick={() => {
            window.scrollTo(0, 0)
          }}
        >
          <img
            src={sonorizaLogo}
            alt="sonoriza-s"
            className="w-28 h-28 mt-auto p-4 fixed right-0 bottom-0"
          />
        </button>
      </div>
    </div>
  )
}
