import { Progress } from '@/components/Progress/Index'
import { Steps } from '@/components/Steps'
import { Total } from '@/components/Total'

export function Home() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-bold text-blue-600 leading-6">Vendas</h1>

      <h3 className="font-bold text-green-400 leading-8">Nova vendas</h3>

      <Progress />

      <Total value={114.75} />

      <Steps />
    </div>
  )
}
