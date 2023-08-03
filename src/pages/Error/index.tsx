import { Button } from '@/components/Button'
import { Layout } from '@/components/Layout'
import notFound from '@/assets/404.png'
import { useNavigate } from 'react-router-dom'

export function Error() {
  const navigate = useNavigate()

  return (
    <Layout isError>
      <div className="bg-white rounded-2xl p-7 mt-8 top-5 max-w-[598px] md:max-w-full flex flex-col items-center">
        <img src={notFound} alt="" className="max-h-96 max-w-96" />
        <h1 className="mt-8 text-lg font-bold">Oops!</h1>
        <p className="text-base">Page not found.</p>
        <Button
          title="Go to home"
          className="mt-4"
          variant="green"
          onClick={() => navigate('/')}
        />
      </div>
    </Layout>
  )
}
