import { useCallback, useEffect, useState } from 'react'
import { Button } from '../Button'
import { Select } from '../form/Select'
import { Input } from '../form/Input'
import { Controller, useForm } from 'react-hook-form'
import { ClientProps } from '@/types/client'
import { v4 as uuidv4 } from 'uuid'

import { yupResolver } from '@hookform/resolvers/yup'
import { clientSchema } from './clientSchema'
import { telePhoneRegex } from '@/utils/masks/telephone'
import { cellPhoneRegex } from '@/utils/masks/cellPhone'
import { cpfRegex } from '@/utils/masks/cpf'
import { rgRegex } from '@/utils/masks/rg'

import { optionsStatesOfBrazil } from '@/utils/statesOfBrazil'

import { maritalStatusOptions } from '@/utils/maritialStatus'
import { genderOptions } from '@/utils/genderOptions'

import { Option } from '@/types/optionSelect'
import { useRequest } from '@/hooks/useRequests'
import { DatePickerCustom } from '../form/DatePicker'
import { handleFormattedDate } from '@/utils/formatDate'
import { useFormContext } from '@/hooks/useForm'

interface FindClientProps {
  check?: React.Dispatch<React.SetStateAction<boolean>>
}

export function FindClient({ check }: FindClientProps) {
  const { formData, updateFormData } = useFormContext()

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientProps>({
    defaultValues: formData,
    resolver: yupResolver(clientSchema),
  })

  const {
    handleFetchCitiesOfState,
    handleFetchClients,
    handleUpdateClient,
    handleCreateClient,
  } = useRequest()

  const [selectedClientId, setSelectedClientId] = useState('')
  const [findClientId, setFindClientId] = useState('')

  const [listCities, setListCities] = useState<Option[]>()
  const [listClients, setListClients] = useState<Option[]>()
  const [clientList, setClientList] = useState<ClientProps[]>()

  const handleFetchCitiesData = useCallback(
    async (state: string) => {
      const responseCities = (await handleFetchCitiesOfState(state)) as Option[]

      setListCities(responseCities)
    },
    [handleFetchCitiesOfState],
  )

  const handleAutoCompleteClientData = useCallback(() => {
    const filterClient = clientList?.find(
      (client) => client.id === findClientId,
    )

    if (filterClient) {
      handleFetchCitiesData(filterClient.stateOfBirth)
      setSelectedClientId(filterClient.id!)
      setValue('name', filterClient.name)
      setValue('cellPhone', filterClient.cellPhone)
      setValue('cityOfBirth', filterClient.cityOfBirth)
      setValue('dateOfBirth', filterClient.dateOfBirth)
      setValue('gender', filterClient.gender)
      setValue('issuingBody', filterClient.issuingBody)
      setValue('maritalStatus', filterClient.maritalStatus)
      setValue('nationality', filterClient.nationality)
      setValue('cpf', filterClient.cpf)
      setValue('rg', filterClient.rg)
      setValue('telePhone', filterClient.telePhone)
      setValue('stateOfBirth', filterClient.stateOfBirth)

      updateFormData(filterClient)

      if (check) {
        check(true)
      }
    }
  }, [
    clientList,
    findClientId,
    handleFetchCitiesData,
    setValue,
    updateFormData,
    check,
  ])

  const handleFetchClientData = useCallback(async () => {
    const responseClients = (await handleFetchClients({})) as ClientProps[]

    setClientList(responseClients)

    const filter = responseClients.map((item) => {
      return {
        value: String(item.id),
        label: item.name,
      }
    })

    setListClients(filter)
  }, [handleFetchClients])

  function submit(data: ClientProps) {
    if (selectedClientId) {
      const client = { ...data, id: selectedClientId }
      handleUpdateClient(client)
      updateFormData(client)
    } else {
      const id = uuidv4()
      const client = { ...data, id }
      handleCreateClient(client)
      setSelectedClientId(id)
      updateFormData(client)
    }
    if (check) {
      check(true)
    }
  }

  useEffect(() => {
    if (formData.id) {
      handleFetchCitiesData(formData.stateOfBirth)
      setSelectedClientId(formData.id)
    }
    handleFetchClientData()
  }, [
    formData,
    formData.id,
    formData.stateOfBirth,
    handleFetchCitiesData,
    handleFetchClientData,
    selectedClientId,
  ])

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
            value={findClientId}
            onChange={(e) => {
              setFindClientId(e.target.value)
            }}
            options={listClients}
          />
          <Button
            title="Buscar"
            disabled={!findClientId}
            variant="dark"
            onClick={() => handleAutoCompleteClientData()}
          />
          <Button
            title="Adicionar Pessoa"
            disabled={!!selectedClientId}
            onClick={() => {
              handleSubmit(submit)()
            }}
          />
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
              value={getValues('cpf')}
              register={register}
              error={errors.cpf}
              onChange={(e) => setValue('cpf', e.currentTarget.value)}
            />

            <Input
              placeholder="31.268.108-2"
              mask={rgRegex}
              label="IE/RG"
              name="rg"
              value={getValues('rg')}
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
              value={getValues('telePhone')}
              register={register}
              error={errors.telePhone}
              onChange={(e) => setValue('telePhone', e.currentTarget.value)}
            />

            <Input
              placeholder="(11) 00000-0000"
              mask={cellPhoneRegex}
              label="Celular"
              name="cellPhone"
              value={getValues('cellPhone')}
              register={register}
              error={errors.cellPhone}
              onChange={(e) => setValue('cellPhone', e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
        <div className="max-w-[130px] md:max-w-full">
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePickerCustom
                label="Data de nascimento"
                name="dateOfBirth"
                register={register}
                selected={field.value ? new Date(field.value) : null}
                error={errors.dateOfBirth}
                onChange={(date) => {
                  field.onChange(handleFormattedDate(date))
                }}
                placeholderText="17/04/1995"
              />
            )}
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
        <Button
          disabled={!selectedClientId}
          title="Atualizar"
          className="max-w-[140px]"
          variant="outline"
        />
      </form>
    </>
  )
}
