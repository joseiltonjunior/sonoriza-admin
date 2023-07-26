import { Item } from './Item'

interface ProgressProps {
  currentIndex: number
}

export function Progress({ currentIndex }: ProgressProps) {
  const items = [
    { name: 'Produto', index: 1 },
    { name: 'Cliente', index: 2 },
    { name: 'Anexar arquivo', index: 3 },
    { name: 'Pagamentos', index: 4 },
    { name: 'Contrato', index: 5 },
  ]

  return (
    <div className="flex rounded-2xl overflow-hidden bg-transparent mt-8">
      <div className="flex md:hidden flex-1 items-center justify-between">
        <Item index={1} title="Produto" currentIndex={currentIndex} />
        <Item index={2} title="Cliente" currentIndex={currentIndex} />
        <Item index={3} title="Anexar arquivo" currentIndex={currentIndex} />
        <Item index={4} title="Pagamentos" currentIndex={currentIndex} />
        <Item index={5} title="Contrato" currentIndex={currentIndex} />
      </div>

      <div className="w-full hidden md:block">
        <Item
          index={items.find((item) => item.index === currentIndex)?.index ?? 1}
          title={items.find((item) => item.index === currentIndex)?.name ?? ''}
          currentIndex={currentIndex}
          // className="bg-red-500"
        />

        <div className="flex w-full justify-center mt-1">
          {items.map((item) => (
            <div
              key={item.index}
              className="w-5 h-5 flex items-center justify-center bg-white rounded-full"
            >
              <div
                className={`w-3 h-3 ${
                  item.index === currentIndex ? ' bg-green-400' : 'bg-gray-300'
                }  rounded-full`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
