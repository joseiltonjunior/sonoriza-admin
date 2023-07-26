import clientAPI from '@/services/api'
import { ClientProps } from '@/types/client'
import { useCallback } from 'react'
import { useToast } from './useToast'
import { CitiesIbgeProps } from '@/types/citiesForIbge'
import ibgeAPI from '@/services/ibgeApi'

interface HandleFetchClientsProps {
  isFormat?: boolean
}

export function useRequest() {
  const { showToast } = useToast()

  const handleFetchClients = useCallback(
    async ({ isFormat }: HandleFetchClientsProps) => {
      try {
        const result = await clientAPI.get('/clients')
        const list = result.data as ClientProps[]

        const filter = list.map((item) => {
          return {
            value: String(item.id),
            label: item.name,
          }
        })
        return isFormat ? filter : list
      } catch {
        showToast('Error ao buscar clientes', {
          type: 'error',
          theme: 'colored',
        })
      }
    },
    [showToast],
  )

  const handleFetchCitiesOfState = useCallback(
    async (state: string) => {
      return ibgeAPI
        .get(`localidades/estados/${state}/municipios`)
        .then((result) => {
          const data = result.data as CitiesIbgeProps[]

          const formatList = data.map((item) => {
            return {
              value: item.nome,
              label: item.nome,
            }
          })

          return formatList
        })
        .catch(() => {
          showToast('Error ao buscar cidades', {
            type: 'error',
            theme: 'colored',
          })
        })
    },
    [showToast],
  )

  return { handleFetchClients, handleFetchCitiesOfState }
}
