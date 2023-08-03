import { Layout } from '@/components/Layout'
import { Progress } from '@/components/Progress/Index'
import { Steps } from '@/components/Steps'
import { Total } from '@/components/Total'

import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { useToast } from '@/hooks/useToast'
import { SalesProps } from '@/types/sales'
import Skeleton from 'react-loading-skeleton'

export function Checkout() {
  const { t } = useTranslation()

  const [sale, setSale] = useState<SalesProps>()
  const { showToast } = useToast()

  const location = useLocation()
  const params = queryString.parse(location.search)
  const saleId = params.id as string

  const handleFetchSale = useCallback(
    async (id: string) => {
      const docRef = doc(firestore, 'sales', id)
      await getDoc(docRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const saleResponses = {
              priceTotal: docSnapshot.data().priceTotal,
              products: docSnapshot.data().products,
              status: docSnapshot.data().status,
              id: docSnapshot.id,
            }

            setSale(saleResponses)
          } else {
            showToast('Sale not found', {
              type: 'warning',
              theme: 'colored',
            })
          }
        })
        .catch(() => {
          showToast('Error while fetching sale', {
            type: 'error',
            theme: 'colored',
          })
        })
    },
    [showToast],
  )

  useEffect(() => {
    if (saleId) {
      handleFetchSale(saleId)
    }
  }, [handleFetchSale, saleId])

  return (
    <Layout>
      <div className="max-w-3xl">
        <h1 className="font-bold text-blue-600 leading-6">{t('titleHome')}</h1>

        <h3 className="font-bold text-green-400 leading-8 text-xl">
          {t('captionHome')}
        </h3>

        <Progress />

        {sale ? (
          <Total value={sale.priceTotal} />
        ) : (
          <Skeleton className="h-[3.2rem] mt-8 rounded-2xl" />
        )}

        <Steps />
      </div>
    </Layout>
  )
}
