import { Button } from '@/components/Button'
import { Input } from '@/components/form/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { signInSchema } from './tokenSchema'
import { Layout } from '@/components/Layout'

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { handleSetAdmin } from '@/storage/modules/admin/reducer'

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

  const { showToast } = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)

  function submit(data: SignInProps) {
    setIsLoading(true)
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((result) => {
        const { email, uid } = result.user
        dispatch(handleSetAdmin({ admin: { email: email ?? '', uid } }))
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

  const auth = getAuth()

  const handleVerifyUser = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, uid } = user
        dispatch(handleSetAdmin({ admin: { email: email ?? '', uid } }))
        navigate('/home')
      }
    })
  }, [auth, dispatch, navigate])

  useEffect(() => {
    handleVerifyUser()
  }, [handleVerifyUser])

  return (
    <Layout isError>
      <div className="max-w-xl">
        <h1 className="font-bold text-gray-700 leading-6">Sonoriza</h1>

        <h3 className="font-bold text-purple-600 leading-8 text-2xl">
          Sign In
        </h3>
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
                label="Password"
                register={register}
                name="password"
                type="password"
                placeholder="password"
                error={errors.password}
              />
            </div>

            <Button
              title="Sign in"
              className="mt-12 w-[252px] ml-full md:w-full"
              variant="purple"
              isLoading={isLoading}
            />
          </form>
        </div>
      </div>
    </Layout>
  )
}
