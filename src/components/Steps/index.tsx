import { useState } from 'react'
import { Button } from '../Button'
import { FindClient } from './FindClient'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import { ProgressProps } from '@/storage/modules/progress/type'
import {
  setDecrementProgress,
  setIncrementProgress,
} from '@/storage/modules/progress/action'
import { AttachFile } from './AttachFile'
import { useTranslation } from 'react-i18next'
import { useModal } from '@/hooks/useModal'

export function Steps() {
  const [checkClient, setCheckClient] = useState(false)
  const [checkFiles, setCheckFiles] = useState(false)

  const { progress } = useSelector<ReduxProps, ProgressProps>(
    (state) => state.progress,
  )

  const dispatch = useDispatch()
  const { openModal } = useModal()
  const { t } = useTranslation()

  return (
    <div className="bg-white rounded-2xl p-7 mt-8 top-5">
      {progress === 2 && <FindClient check={setCheckClient} />}
      {progress === 3 && <AttachFile check={setCheckFiles} />}

      <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
      <div className="flex gap-4">
        <Button
          disabled={
            (!checkClient && progress === 2) || (!checkFiles && progress === 3)
          }
          title={t('buttonContinue')}
          className="max-w-[140px]"
          variant="green"
          type="button"
          onClick={() => {
            if (progress === 3) {
              openModal({
                title: t('modalAcknowledgment.title'),
                description: t('modalAcknowledgment.description'),
                singleButton: true,
                confirm() {},
              })

              return
            }

            dispatch(setIncrementProgress())
          }}
        />
        <button
          disabled={progress === 2}
          className="text-blue-600 underline text-sm font-bold hover:text-blue-600/90"
          type="button"
          onClick={() => dispatch(setDecrementProgress())}
        >
          {t('buttonBack')}
        </button>
      </div>
    </div>
  )
}
