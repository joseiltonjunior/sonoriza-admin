import { PropsWithChildren } from 'react'
import { Header } from '../Header'
import { Aside } from '@/components/Aside'

interface LayoutProps extends PropsWithChildren {}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <div className="pt-20 flex h-[calc(100vh-80px)]">
        <Aside />
        <main className="py-20 px-10 w-screen h-[calc(100vh-80px)] md:py-10 md:px-5">
          {children}
        </main>
      </div>
    </>
  )
}
