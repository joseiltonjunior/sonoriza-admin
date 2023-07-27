import { PropsWithChildren } from 'react'
import { Header } from './Header'
import { Aside } from './Aside'

interface LayoutProps extends PropsWithChildren {}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <div className="pt-20 flex h-full ">
        <Aside />
        <main className="ml-[350px] w-screen py-20 px-10 md:py-10 md:px-5 base:ml-0">
          {children}
        </main>
      </div>
    </>
  )
}
