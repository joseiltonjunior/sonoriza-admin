import { Layout } from '@/components/Layout'

import { useTranslation } from 'react-i18next'

import { useToast } from '@/hooks/useToast'

import { collection, getDocs, query } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { useCallback, useEffect, useState } from 'react'
import { SalesProps } from '@/types/sales'

import arrow from '@/assets/arrow-strong.svg'
import { formatStatusSale } from '@/utils/statusSale'
import { formatMoney } from '@/utils/formatMoney'
import Skeleton from 'react-loading-skeleton'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const { t } = useTranslation()
  const { showToast } = useToast()

  const [sales, setSales] = useState<SalesProps[]>()

  const navigate = useNavigate()

  const handleFetchSales = useCallback(() => {
    const q = query(collection(firestore, 'sales'))
    getDocs(q)
      .then((querySnapshot) => {
        const salesResponses = querySnapshot.docs.map(
          (doc) =>
            ({
              priceTotal: doc.data().priceTotal,
              products: doc.data().products,
              status: doc.data().status,
              id: doc.id,
            }) as SalesProps,
        )

        setSales(salesResponses)
      })
      .catch(() => {
        showToast('Error while fetching sales', {
          type: 'error',
          theme: 'colored',
        })
      })
  }, [showToast])

  useEffect(() => {
    handleFetchSales()
  }, [handleFetchSales])

  return (
    <Layout>
      <div className="max-w-3xl">
        <h1 className="font-bold text-blue-600 leading-6">{t('titleHome')}</h1>

        <h3 className="font-bold text-green-400 leading-8 text-xl">
          Listar vendas
        </h3>

        {sales ? (
          sales.map((sale) => (
            <button
              onClick={() => {
                navigate(`/checkout?id=${sale.id}`)
              }}
              key={sale.id}
              className={`bg-white rounded-2xl p-7 mt-8 top-5 flex justify-between items-center border hover:border-gray-300 ${
                sale.status === 1 && 'border-red-500'
              }`}
            >
              <div>
                <strong>ID da venda</strong>
                <p>{sale.id}</p>
              </div>

              <div>
                <strong>Status</strong>
                <p>{formatStatusSale(sale.status)}</p>
              </div>

              <div>
                <strong>Valor total</strong>
                <p>{formatMoney(sale.priceTotal)}</p>
              </div>

              <div>
                <img src={arrow} alt="arrow" className="w-6 h-6 -rotate-90" />
              </div>
            </button>
          ))
        ) : (
          <Skeleton className="h-[106px] mt-8 rounded-2xl" />
        )}
      </div>
    </Layout>
  )
}
