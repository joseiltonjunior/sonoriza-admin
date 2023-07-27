import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { v4 as uuidv4 } from 'uuid'
import { ClientProps } from '@/types/client'
import { findClientByCpf } from '@/utils/tests/findClientByCpf'

describe('Check CRUD API', () => {
  it('slould be able to fetch many clients', async () => {
    const apiUrl = import.meta.env.VITE_API_URL

    const response = await request(apiUrl).get('/clients').send()

    const clients = JSON.parse(response.text) as ClientProps[]

    expect(response.statusCode).toEqual(200)

    expect(Array.isArray(clients)).toBe(true)

    clients.forEach((client) => {
      expect(client).toHaveProperty('name')
      expect(typeof client.name).toBe('string')
    })
  })

  it('should be able to add a new cliente', async () => {
    const apiUrl = import.meta.env.VITE_API_URL

    const newClient: ClientProps = {
      id: uuidv4(),
      name: 'John Doe',
      cpf: '123.456.789-00',
      rg: '987654321',
      issuingBody: 'SSP',
      cellPhone: '999999999',
      telePhone: '888888888',
      dateOfBirth: '1990-01-01',
      nationality: 'Brazilian',
      stateOfBirth: 'SP',
      cityOfBirth: 'Sao Paulo',
      maritalStatus: 'Single',
      gender: 'Male',
    }

    const response = await request(apiUrl).post('/clients').send(newClient)

    expect(response.statusCode).toEqual(201)

    const addedClient: ClientProps = JSON.parse(response.text)
    expect(addedClient).toMatchObject(newClient)
  })
})

it('should be able to edit an existing cliente', async () => {
  const apiUrl = import.meta.env.VITE_API_URL

  const clientToEdit = await findClientByCpf('123.456.789-00')

  expect(clientToEdit).toBeDefined()

  if (clientToEdit) {
    const editedClient: ClientProps = {
      ...clientToEdit,
      name: 'Novo Nome',
      cellPhone: '99998888',
      telePhone: '77776666',
    }

    const putResponse = await request(apiUrl)
      .put(`/clients/${clientToEdit.id}`)
      .send(editedClient)

    expect(putResponse.statusCode).toEqual(200)

    const updatedClient: ClientProps = JSON.parse(putResponse.text)
    expect(updatedClient).toMatchObject(editedClient)
  }
})

it('should be able to delete an existing cliente', async () => {
  const apiUrl = import.meta.env.VITE_API_URL

  const clientToDelete = await findClientByCpf('123.456.789-00')

  expect(clientToDelete).toBeDefined()

  if (clientToDelete) {
    const clientIdToDelete = clientToDelete.id

    const deleteResponse = await request(apiUrl)
      .delete(`/clients/${clientIdToDelete}`)
      .send()

    expect(deleteResponse.statusCode).toEqual(200)
  }
})
