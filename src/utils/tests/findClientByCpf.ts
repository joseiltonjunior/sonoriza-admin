import request from 'supertest'
import { ClientProps } from '@/types/client'

export async function findClientByCpf(cpf: string) {
  const apiUrl = 'http://localhost:3001'

  const getResponse = await request(apiUrl).get('/clients').send()

  const clients: ClientProps[] = JSON.parse(getResponse.text)

  const clientToEdit = clients.find((client) => client.cpf === cpf)

  if (clientToEdit) {
    return clientToEdit
  }
}
