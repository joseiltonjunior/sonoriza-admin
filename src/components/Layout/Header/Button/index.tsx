interface ButtonProps {
  icon: string
}

export function Button({ icon }: ButtonProps) {
  return (
    <div className="w-9 h-9 bg-gray-200 items-center flex justify-center rounded-full cursor-pointer">
      <img src={icon} alt="bell" />
    </div>
  )
}
