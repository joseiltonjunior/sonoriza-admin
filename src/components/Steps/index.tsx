import { useState } from 'react'
import { Button } from '../Button'
import { FindClient } from '../FindClient'

export function Steps() {
  const [checkClient, setCheckClient] = useState(false)

  return (
    <div className="bg-white rounded-2xl p-7 mt-8 top-5">
      <FindClient check={setCheckClient} />
      <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
      <div className="flex gap-4">
        <Button
          disabled={!checkClient}
          title="Continuar"
          className="max-w-[140px]"
          variant="green"
          type="button"
          onClick={() => console.log('ok')}
        />
        <button
          className="text-blue-600 underline text-sm font-bold hover:text-blue-600/90"
          type="button"
        >
          Voltar
        </button>
      </div>
    </div>
  )
}
