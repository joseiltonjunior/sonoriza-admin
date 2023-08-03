import { Layout } from '@/components/Layout'
import { Progress } from '@/components/Progress/Index'
import { Steps } from '@/components/Steps'
import { Total } from '@/components/Total'

import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { decodeToken } from 'react-jwt'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'

export function Checkout() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [price, setPrice] = useState(0)

  const location = useLocation()
  const params = queryString.parse(location.search)
  const token = params.token as string

  const handleGetPrice = useCallback(() => {
    const decode = decodeToken(token) as {
      id: string
      price: number
    }

    if (decode && decode.id) {
      setPrice(decode.price)

      return
    }

    navigate(`/`)
  }, [navigate, token])

  useEffect(() => {
    if (token) {
      handleGetPrice()
    } else if (!params.token) {
      navigate(`/`)
    }
  }, [handleGetPrice, navigate, params.token, token])

  return (
    <Layout>
      <div className="max-w-3xl">
        <h1 className="font-bold text-blue-600 leading-6">{t('titleHome')}</h1>

        <h3 className="font-bold text-green-400 leading-8 text-xl">
          {t('captionHome')}
        </h3>

        <Progress />

        <Total value={price} />

        <Steps />
      </div>
    </Layout>
  )
}
