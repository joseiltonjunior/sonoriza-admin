import { Button } from '@/components/Button'
import { Input } from '@/components/form/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { signInSchema } from './tokenSchema'
import { Layout } from '@/components/Layout'
import { useTranslation } from 'react-i18next'
import { auth } from '@/services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface SignInProps {
  email: string
  password: string
}

export function SignIn() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInProps>({
    resolver: yupResolver(signInSchema),
  })

  const { t } = useTranslation()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  function submit(data: SignInProps) {
    setIsLoading(true)
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        navigate(`/home`)
      })
      .catch(() => {
        setError('email', { message: '* credenciais inválidas' })
        setError('password', { message: '* credenciais inválidas' })

        showToast('Credenciais inválidas', {
          type: 'error',
          theme: 'colored',
        })
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Layout isError>
      <div className="max-w-xl">
        <h1 className="font-bold text-blue-600 leading-6">{t('titleHome')}</h1>

        <h3 className="font-bold text-green-400 leading-8 text-xl">Sign In</h3>
        <div className="bg-white rounded-2xl p-7 mt-8 top-5">
          <form
            onSubmit={handleSubmit(submit)}
            className="max-w-[598px] md:max-w-full flex flex-col items-end"
          >
            <div className="grid grid-cols-[1fr,1fr]  gap-4 w-full md:grid-cols-1">
              <Input
                label="E-mail"
                register={register}
                name="email"
                type="text"
                placeholder="e-mail"
                error={errors.email}
              />
              <Input
                label="Senha"
                register={register}
                name="password"
                type="password"
                placeholder="password"
                error={errors.password}
              />
            </div>

            <Button
              title="Entrar"
              className="mt-12 w-[252px] ml-full md:w-full"
              variant="green"
              isLoading={isLoading}
            />
          </form>
        </div>
      </div>
    </Layout>
  )
}
