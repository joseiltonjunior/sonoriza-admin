interface ItemProps {
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
      className={`${
        isCurrent
          ? 'bg-blue-400 text-white rounded-r-2xl  z-10'
          : isBeforeCurrent
          ? 'bg-green-400 text-white rounded-r-2xl z-20 '
          : 'bg-white'
      } font-bold text-sm w-auto items-center flex justify-center -ml-7 px-12 md:p-0 md:m-0 md:bg-green-400 md:text-base h-[3.35rem] md:rounded-2xl
      `}
    >
      <p className={`${isAfterCurrent && 'text-green-400'}`}>{index}</p>
      <p className="ml-2">{title}</p>
    </div>
  )
}
