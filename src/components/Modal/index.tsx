import { useTranslation } from 'react-i18next'
import { useModal } from '../../hooks/useModal'
import { Button } from '../Button'
import x from '@/assets/x.svg'

export function Modal() {
  const {
    closeModal,
    modalState: { visible, description, title, confirm, singleButton },
  } = useModal()

  const { t } = useTranslation()

  return (
    <div
      className={`h-screen w-screen fixed z-[100]  ${
        visible ? 'visible' : 'hidden'
      } items-center flex justify-center px-4`}
    >
      <div
        onClick={() => closeModal()}
        className="bg-blue-600/70 h-full w-full absolute"
      />
      <div className="bg-white max-w-[451px] w-full min-h-[191px] z-10 rounded-[20px] p-6  flex flex-col justify-between relative">
        <button
          className="bg-gray-300 absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center "
          onClick={closeModal}
        >
          <img src={x} alt="close modal" />
        </button>

        <div>
          <p className="text-lg font-bold">{title}</p>
          <div className="bg-green-400 rounded-3xl h-1 w-6" />
          <p className="text-sm font-normal mt-4">{description}</p>
        </div>

        <div className="h-[1px] bg-gray-300/50 max-w-[598px] my-5 md:max-w-full" />

        {singleButton ? (
          <Button
            title="Fechar"
            variant="green"
            onClick={() => {
              if (confirm) confirm()
              closeModal()
            }}
          />
        ) : (
          <div className="flex items-end justify-between">
            <button
              onClick={closeModal}
              className="text-blue-600 underline text-sm font-normal hover:text-blue-600/90"
            >
              {t('buttonBack')}
            </button>
            <Button
              className="w-[93px]"
              variant="red"
              title={t('buttonDelete')}
              onClick={() => {
                if (confirm) confirm()
                closeModal()
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
