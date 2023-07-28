import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { CitiesIbgeProps } from '@/types/citiesForIbge'

describe('Check IBGE API', () => {
  it('slould be able to fetch many cities for IBGE API', async () => {
    const apiUrl = 'http://servicodados.ibge.gov.br/api/v1'
    const state = 'PE'

    const response = await request(apiUrl)
      .get(`/localidades/estados/${state}/municipios`)
      .send()

    const cities = JSON.parse(response.text) as CitiesIbgeProps[]

    expect(response.statusCode).toEqual(200)

    expect(Array.isArray(cities)).toBe(true)

    cities.forEach((city) => {
      expect(city).toHaveProperty('nome')
      expect(typeof city.nome).toBe('string')
    })
  })
})
