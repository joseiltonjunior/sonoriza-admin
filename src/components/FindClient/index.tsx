import { useCallback, useEffect, useState } from 'react'
import { Button } from '../Button'
import { Select } from '../Select'
import { Input } from '../Input'
import { useForm } from 'react-hook-form'
import { ClientProps } from '@/types/client'

import { yupResolver } from '@hookform/resolvers/yup'
import { clientSchema } from './clientSchema'
import { telePhoneRegex } from '@/utils/masks/telephone'
import { cellPhoneRegex } from '@/utils/masks/cellPhone'
import { cpfRegex } from '@/utils/masks/cpf'
import { rgRegex } from '@/utils/masks/rg'
import { dateOfBirthMask } from '@/utils/masks/dateOfBirth'
import { optionsStatesOfBrazil } from '@/utils/statesOfBrazil'

import { maritalStatusOptions } from '@/utils/maritialStatus'
import { genderOptions } from '@/utils/genderOptions'

import { Option } from '@/types/optionSelect'
import { useRequest } from '@/hooks/useRequests'

interface FindClientProps {
  check?: React.Dispatch<React.SetStateAction<boolean>>
}

export function FindClient({ check }: FindClientProps) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientProps>({
    defaultValues: {
      cellPhone: '',
      cityOfBirth: '',
      cpf: '',
      dateOfBirth: '',
      gender: '',
      issuingBody: '',
      maritalStatus: '',
      name: '',
      nationality: '',
      rg: '',
      stateOfBirth: '',
      telePhone: '',
    },
    resolver: yupResolver(clientSchema),
  })

  const { handleFetchCitiesOfState, handleFetchClients } = useRequest()

  const [selectedOption, setSelectedOption] = useState('')

  const [listCities, setListCities] = useState<Option[]>()
  const [listClients, setListClients] = useState<Option[]>()

  function submit(data: ClientProps) {
    console.log(data)
    if (check) {
      check(true)
    }
  }

  const handleFetchClientData = useCallback(async () => {
    const responseClients = (await handleFetchClients({
      isFormat: true,
    })) as Option[]

    setListClients(responseClients)
  }, [handleFetchClients])

  const handleFetchCitiesData = useCallback(
    async (state: string) => {
      const responseCities = (await handleFetchCitiesOfState(state)) as Option[]

      setListCities(responseCities)
    },
    [handleFetchCitiesOfState],
  )

  useEffect(() => {
    handleFetchClientData()
  }, [handleFetchClientData])

  return (
    <>
      <div className="max-w-[562px] md:max-w-full">
        <div>
          <h1 className="font-bold text-lg">Buscar cliente</h1>
          <div className="bg-green-400 rounded-3xl h-1 w-6" />
        </div>

        <div className="grid md:grid-cols-1 grid-cols-[318px,80px,140px] gap-4 items-end">
          <Select
            label="Buscar cliente"
            placeholder="Selecione um cliente"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            options={listClients}
          />
          <Button title="Buscar" variant="dark" />
          <Button title="Adicionar Pessoa" />
        </div>
      </div>
      <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
      <form onSubmit={handleSubmit(submit)}>
        <div className="max-w-[410px] md:max-w-full">
          <Input
            placeholder="Antônio José dos Santos"
            label="Nome completo"
            name="name"
            register={register}
            error={errors.name}
          />

          <div className="grid md:grid-cols-1 grid-cols-[149px,125px,107px] gap-4">
            <Input
              placeholder="407.495.188-98"
              mask={cpfRegex}
              label="CPF"
              name="cpf"
              register={register}
              error={errors.cpf}
              onChange={(e) => setValue('cpf', e.currentTarget.value)}
            />

            <Input
              placeholder="31.268.108-2"
              mask={rgRegex}
              label="IE/RG"
              name="rg"
              register={register}
              error={errors.rg}
              onChange={(e) => setValue('rg', e.currentTarget.value)}
            />

            <Input
              placeholder="SSP"
              label="Órgão emissor"
              name="issuingBody"
              maxLength={3}
              register={register}
              error={errors.issuingBody}
            />
          </div>

          <div className="grid md:grid-cols-1 grid-cols-[150px,150px] gap-4">
            <Input
              placeholder="(11) 0000-0000"
              mask={telePhoneRegex}
              label="Telefone"
              name="telePhone"
              register={register}
              error={errors.telePhone}
              onChange={(e) => setValue('telePhone', e.currentTarget.value)}
            />

            <Input
              placeholder="(11) 00000-0000"
              mask={cellPhoneRegex}
              label="Celular"
              name="cellPhone"
              register={register}
              error={errors.cellPhone}
              onChange={(e) => setValue('cellPhone', e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
        <div className="max-w-[130px] md:max-w-full">
          <Input
            mask={dateOfBirthMask}
            placeholder="17/04/1995"
            label="Data de nascimento"
            name="dateOfBirth"
            register={register}
            error={errors.dateOfBirth}
            onChange={(e) => setValue('dateOfBirth', e.currentTarget.value)}
          />

          <Input
            placeholder="Brasileira"
            label="Nacionalidade"
            name="nationality"
            register={register}
            error={errors.nationality}
          />
        </div>
        <div className="max-w-[298px] md:max-w-full">
          <Select
            placeholder="Selecione"
            options={optionsStatesOfBrazil}
            label="Estado de nascimento"
            name="stateOfBirth"
            register={register}
            error={errors.stateOfBirth}
            onChange={(e) => handleFetchCitiesData(e.target.value)}
          />
          <Select
            placeholder="Selecione"
            options={listCities}
            name="cityOfBirth"
            register={register}
            label="Naturalidade (Cidade de nascimento)"
            error={errors.cityOfBirth}
          />
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
        <div className="max-w-[211px] md:max-w-full">
          <Select
            placeholder="Selecione"
            label="Estado civil"
            name="maritalStatus"
            register={register}
            options={maritalStatusOptions}
            error={errors.maritalStatus}
          />
          <Select
            placeholder="Selecione"
            options={genderOptions}
            label="Sexo"
            name="gender"
            register={register}
            error={errors.gender}
          />
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
        <Button title="Atualizar" className="max-w-[140px]" variant="outline" />
      </form>
    </>
  )
}
