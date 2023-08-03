import { ClientProps } from '@/types/client'
import { useCallback } from 'react'
import { useToast } from './useToast'
import { CitiesIbgeProps } from '@/types/citiesForIbge'
import ibgeAPI from '@/services/ibgeApi'
import {
  getDocs,
  query,
  collection,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore'

import { firestore } from '@/services/firebase'

export function useRequest() {
  const { showToast } = useToast()

  const handleFetchClients = useCallback(async () => {
    const q = query(collection(firestore, 'clients'))

    try {
      const clientsResponse = await getDocs(q).then((querySnapshot) => {
        const response = querySnapshot.docs.map(
          (doc) =>
            ({
              cellPhone: doc.data().cellPhone,
              telePhone: doc.data().telePhone,
              name: doc.data().name,
              nationality: doc.data().nationality,
              id: doc.id,
              issuingBody: doc.data().issuingBody,
              dateOfBirth: doc.data().dateOfBirth,
              stateOfBirth: doc.data().stateOfBirth,
              cityOfBirth: doc.data().cityOfBirth,
              cpf: doc.data().cpf,
              rg: doc.data().rg,
              maritalStatus: doc.data().maritalStatus,
              gender: doc.data().gender,
            }) as ClientProps,
        )

        return response
      })

      return clientsResponse
    } catch (err) {
      showToast('Error ao buscar clientes', {
        type: 'error',
        theme: 'colored',
      })
    }
  }, [showToast])

  interface handleUpdateClientProps {
    clientId: string
    updateClient: ClientProps
  }

  const handleUpdateClient = useCallback(
    async ({ clientId, updateClient }: handleUpdateClientProps) => {
      try {
        const docRef = doc(firestore, 'clients', clientId)

        await updateDoc(docRef, { ...updateClient })

        showToast('Cliente atualizado com sucesso', {
          type: 'success',
          theme: 'colored',
        })
      } catch {
        showToast('Error ao editar cliente', {
          type: 'error',
          theme: 'colored',
        })
      }
    },
    [showToast],
  )

  const handleCreateClient = useCallback(
    async (client: ClientProps) => {
      try {
        const docRef = await addDoc(collection(firestore, 'clients'), client)

        showToast('Cliente adicionado com sucesso', {
          type: 'success',
          theme: 'colored',
        })

        return { id: docRef.id }
      } catch {
        showToast('Error ao adicionar cliente', {
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

  return {
    handleFetchClients,
    handleFetchCitiesOfState,
    handleUpdateClient,
    handleCreateClient,
  }
}
