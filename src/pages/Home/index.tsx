import { Content } from '@/components/Content'
import { Progress } from '@/components/Progress/Index'
import { Total } from '@/components/Total'

export function Home() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-bold text-blue-600 leading-6">Vendas</h1>

      <h1 className="font-bold text-green-400 leading-8">Nova vendas</h1>

      <Progress currentIndex={2} />

      <Total value={114.75} />

      <Content title="Buscar cliente" />
    </div>
  )
}
