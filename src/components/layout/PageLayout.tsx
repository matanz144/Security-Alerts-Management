import type { ReactNode } from 'react'

interface IPageLayoutProps {
  children: ReactNode
}

export const PageLayout = ({ children }: IPageLayoutProps) => {
  return (
    <main className="mx-auto max-w-screen-xl px-6 py-8">
      {children}
    </main>
  )
}
