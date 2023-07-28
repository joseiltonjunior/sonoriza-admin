import { useModal } from '../../hooks/useModal'
import { Button } from '../Button'

export function Modal() {
  const {
    closeModal,
    modalState: { visible, description, title, confirm },
  } = useModal()

  console.log(visible)

  return (
    <div
      className={`h-screen w-screen fixed z-[100]  ${
        visible ? 'visible' : 'hidden'
      } items-center flex justify-center`}
    >
      <div
        onClick={() => closeModal()}
        className="bg-blue-600/70 h-full w-full"
      />
      <div className="bg-white max-w-[451px] w-full h-[191px] z-10 rounded-[20px] p-6 absolute flex flex-col justify-between">
        <div>
          <p className="text-lg font-bold">{title}</p>
          <div className="bg-green-400 rounded-3xl h-1 w-6" />
          <p className="text-sm font-normal mt-4">{description}</p>
        </div>

        <div className="h-[1px] bg-gray-300/50 max-w-[598px] md:max-w-full" />

        <div className="flex items-end justify-between">
          <button
            onClick={closeModal}
            className="text-blue-600 underline text-sm font-normal hover:text-blue-600/90"
          >
            voltar
          </button>
          <Button
            className="w-[93px]"
            variant="red"
            title="Exluir"
            onClick={() => {
              if (confirm) confirm()
              closeModal()
            }}
          />
        </div>
      </div>
    </div>
  )
}
