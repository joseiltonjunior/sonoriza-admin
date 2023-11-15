import { useTranslation } from 'react-i18next'
import { useModal } from '../../hooks/useModal'
import { Button } from '../Button'
import { IoClose } from 'react-icons/io5'

export function Modal() {
  const {
    closeModal,
    modalState: {
      visible,
      description,
      title,
      children,
      confirm,
      singleButton,
      textConfirm,
    },
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
        className="bg-gray-700/80 h-full w-full absolute"
      />
      <div
        className={`${
          children ? 'max-w-[800px]' : 'max-w-[451px]'
        } bg-white  w-full min-h-[191px] z-10 rounded-[20px] p-6  flex flex-col justify-between relative`}
      >
        <button
          className="bg-purple-600 absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center "
          onClick={closeModal}
        >
          <IoClose color="#fff" />
        </button>

        {children || (
          <>
            <div>
              <p className="text-lg font-bold">{title}</p>
              <div className="bg-purple-600 rounded-3xl h-1 w-6" />
              <p className="text-sm font-normal mt-4">{description}</p>
            </div>

            <div className="h-[1px] bg-gray-300/50 max-w-[598px] my-5 md:max-w-full" />

            {singleButton ? (
              <Button
                title="Close"
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
                  className="text-gray-700 underline text-sm font-normal hover:text-gray-700/90"
                >
                  Back
                </button>
                <Button
                  className="w-[93px]"
                  variant="red"
                  title={textConfirm || t('buttonDelete')}
                  onClick={() => {
                    if (confirm) confirm()
                    closeModal()
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
