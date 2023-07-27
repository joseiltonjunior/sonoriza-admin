import { useState } from 'react'
import { Button } from '../Button'
import { FindClient } from '../FindClient'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import { ProgressProps } from '@/storage/modules/progress/type'
import {
  setDecrementProgress,
  setIncrementProgress,
} from '@/storage/modules/progress/action'

export function Steps() {
  const [checkClient, setCheckClient] = useState(false)

  const { progress } = useSelector<ReduxProps, ProgressProps>(
    (state) => state.progress,
  )

  const dispatch = useDispatch()

  return (
    <div className="bg-white rounded-2xl p-7 mt-8 top-5">
      {progress === 2 && <FindClient check={setCheckClient} />}
      {progress === 3 && <>aaaaa</>}

      <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
      <div className="flex gap-4">
        <Button
          disabled={!checkClient}
          title="Continuar"
          className="max-w-[140px]"
          variant="green"
          type="button"
          onClick={() => {
            console.log('oux')
            dispatch(setIncrementProgress())
          }}
        />
        <button
          className="text-blue-600 underline text-sm font-bold hover:text-blue-600/90"
          type="button"
          onClick={() => dispatch(setDecrementProgress())}
        >
          Voltar
        </button>
      </div>
    </div>
  )
}
