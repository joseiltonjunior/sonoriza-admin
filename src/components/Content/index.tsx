import { useState } from 'react'
import { Button } from '../Button'
import { Select } from '../Select'

interface ContentProps {
  title: string
}

export function Content({ title }: ContentProps) {
  const options = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
  ]

  const [selectedOption, setSelectedOption] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value)
  }

  return (
    <div className="bg-white rounded-2xl py-7 px-5 mt-8">
      <div className="max-w-[562px]">
        <div>
          <h1 className="font-bold text-lg">{title}</h1>
          <div className="bg-green-400 rounded-3xl h-1 w-6" />
        </div>

        <h4 className="font-bold text-sm mt-4">Buscar cliente</h4>

        <div className="grid md:grid-cols-1 grid-cols-[2.5fr,1fr,1.5fr] gap-2 mt-4">
          <Select
            placeholder="Selecione um cliente"
            value={selectedOption}
            onChange={handleChange}
            options={options}
          />
          <Button title="Buscar" button="dark" />
          <Button title="Adicionar Pessoa" />
        </div>
      </div>
      <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px]" />
    </div>
  )
}
