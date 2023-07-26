import { ComponentProps } from 'react'

interface ItemProps extends ComponentProps<'div'> {
  title: string
  index: number
  currentIndex?: number
}

export function Item({ title, index, currentIndex }: ItemProps) {
  const isCurrent = currentIndex && currentIndex === index
  const isBeforeCurrent = currentIndex && index < currentIndex
  const isAfterCurrent = currentIndex && index > currentIndex

  return (
    <div
      data-is-current={isCurrent}
      data-is-before-current={isBeforeCurrent}
      className={`font-bold text-sm h-[3.35rem] items-center flex justify-center bg-white -ml-7 px-12  data-[is-before-current=true]:before-current-progress md:progress-item-mobile data-[is-current=true]:current-progress`}
    >
      <p
        data-is-after-current={isAfterCurrent}
        data-is-first-item={index === 1}
        className={`data-[is-after-current=true]:text-green-400 data-[is-first-item=true]:ml-6 md:ml-0`}
      >
        {index}
      </p>
      <p className="ml-2">{title}</p>
    </div>
  )
}
