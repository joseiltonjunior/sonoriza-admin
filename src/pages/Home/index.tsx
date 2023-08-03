import { Button } from '@/components/Button'
import { Layout } from '@/components/Layout'
import { Input } from '@/components/form/Input'
import { useForm } from 'react-hook-form'
import { decodeToken } from 'react-jwt'

import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { tokenSchema } from './tokenSchema'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const { t } = useTranslation()
  const { showToast } = useToast()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ token: string }>({ resolver: yupResolver(tokenSchema) })

  function submit(data: { token: string }) {
    const decode = decodeToken(data.token) as {
      id: string
      price: number
    }

    if (decode && decode.id) {
      navigate(`/checkout?token=${data.token}`)
      return
    }

    setError('token', { message: 'Invalid token' })

    showToast('Invalid Token', {
      type: 'error',
      theme: 'colored',
    })
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        <h1 className="font-bold text-blue-600 leading-6">{t('titleHome')}</h1>

        <h3 className="font-bold text-green-400 leading-8 text-xl">
          Buscar venda
        </h3>

        <div className="bg-white rounded-2xl p-7 mt-8 top-5">
          <form
            onSubmit={handleSubmit(submit)}
            className="relative max-w-[598px] md:max-w-full"
          >
            <Input
              name="token"
              register={register}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicHJpY2UiOjEyMjJ9.Q55CLywSNqgCOSXsyMpZvpf6gmJX5ucujBcxgyVHgf0"
              label={'Digite o código da venda'}
              error={errors.token}
            />
            <Button title="Pesquisar" className="mt-4" />
          </form>
        </div>
      </div>
    </Layout>
  )
}
