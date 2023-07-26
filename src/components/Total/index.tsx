import arrow from '@/assets/arrow-strong.svg'

interface TotalProps {
  value: number
}

export function Total({ value }: TotalProps) {
  const valorFormatado = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="bg-white mt-8 rounded-2xl h-[3.2rem] items-center justify-end flex overflow-hidden">
      <div className="flex bg-blue-600 w-[19.063rem] md:w-full h-full items-center rounded-2xl px-5 justify-between">
        <div className="flex gap-7">
          <p className="text-white font-bold">Subtotal</p>
          <p className="text-green-400 font-semibold">{valorFormatado}</p>
        </div>

        <img src={arrow} alt="arrow" className="w-4 h-4" />
      </div>
    </div>
  )
}
