import { Button } from '@/components/Button'
import { Input } from '@/components/form/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { signInSchema } from './tokenSchema'
import { Layout } from '@/components/Layout'

import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { handleSetAdmin } from '@/storage/modules/admin/reducer'

import { api, logoutCurrentSession } from '@/services/api'
import { clearSessionTokens, setSessionTokens } from '@/services/authStorage'
import { buildWebDevice } from '@/services/webDevice'

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

  async function handleAuthenticateUser(data: SignInProps) {
    clearSessionTokens()
    setIsLoading(true)

    const device = buildWebDevice('admin-web@1.0.0')

    try {
      const response = await api.post('/sessions', {
        email: data.email,
        password: data.password,
        device,
      })

      const {
        access_token: accessToken,
        user,
        refresh_token: refreshToken,
      } = response.data

      if (user.role !== 'ADMIN') {
        await logoutCurrentSession(refreshToken).catch(() => undefined)
        clearSessionTokens()

        showToast(`Unauthorized Access`, {
          type: 'error',
          theme: 'light',
        })

        return
      }

      setSessionTokens({
        accessToken,
        refreshToken,
      })

      dispatch(
        handleSetAdmin({
          admin: {
            email: user.email,
            name: user.name,
            photoURL: user.photoUrl,
            id: user.id,
          },
        }),
      )

      navigate(`/home`, { replace: true })
      showToast(`Welcome Back ${user.name?.split(' ')[0]}.`, {
        type: 'info',
        theme: 'light',
      })
    } catch (err) {
      const errResponse = err as {
        response?: { data?: { message?: string } }
      }
      const message =
        errResponse.response?.data?.message ?? 'Error authenticating user'

      setError('email', { message: `* ${message}` })
      setError('password', { message: `* ${message}` })

      showToast(message, {
        type: 'error',
        theme: 'light',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout isError>
      <div className="max-w-xl">
        <h1 className="font-bold text-gray-700 leading-6">Sonoriza</h1>

        <h3 className="font-bold text-purple-600 leading-8 text-2xl">
          Sign In
        </h3>
        <div className="bg-white rounded-2xl p-7 mt-8 top-5">
          <form
            onSubmit={handleSubmit(handleAuthenticateUser)}
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
