import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { Select } from '@/components/form/Select'
import { Input } from '@/components/form/Input'
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
import { DatePickerCustom } from '@/components/form/DatePicker'
import { handleFormattedDate } from '@/utils/formatDate'
import { useFormContext } from '@/hooks/useForm'
import { useTranslation } from 'react-i18next'

interface FindClientProps {
  check: React.Dispatch<React.SetStateAction<boolean>>
}

export function FindClient({ check }: FindClientProps) {
  const { formData, updateFormData, resetFormContext } = useFormContext()

  const { t } = useTranslation()

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
          <h1 className="font-bold text-lg">{t('findClient.title')}</h1>
          <div className="bg-green-400 rounded-3xl h-1 w-6" />
        </div>

        <div className="grid md:grid-cols-1 grid-cols-[318px,80px,140px] gap-4 items-end">
          <Select
            label={t('findClient.findClient')}
            placeholder={t('findClient.select')}
            value={findClientId}
            onChange={(e) => {
              setFindClientId(e.target.value)
            }}
            options={listClients}
          />
          <Button
            title={t('findClient.buttonFetch')}
            disabled={!findClientId}
            variant="dark"
            onClick={() => handleAutoCompleteClientData()}
          />
          <Button
            title={t('findClient.buttonAdd')}
            disabled={!!selectedClientId}
            onClick={() => {
              handleSubmit(submit)()
            }}
          />
        </div>
      </div>
      <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
      <form
        onSubmit={handleSubmit(submit)}
        className="relative max-w-[598px] md:max-w-full"
      >
        {selectedClientId && (
          <button
            className="absolute right-0 text-rose-500 hover:underline"
            type="button"
            onClick={() => {
              setSelectedClientId('')
              setFindClientId('')
              resetFormContext()
              setValue('name', '')
              setValue('cellPhone', '')
              setValue('cityOfBirth', '')
              setValue('dateOfBirth', '')
              setValue('gender', '')
              setValue('issuingBody', '')
              setValue('maritalStatus', '')
              setValue('nationality', '')
              setValue('cpf', '')
              setValue('rg', '')
              setValue('telePhone', '')
              setValue('stateOfBirth', '')
            }}
          >
            {t('cleanForm')}
          </button>
        )}
        <div className="max-w-[410px] md:max-w-full">
          <Input
            placeholder="Antônio José dos Santos"
            label={t('findClient.name')}
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
              label={t('findClient.issuingBody')}
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
              label={t('findClient.telephone')}
              name="telePhone"
              value={getValues('telePhone')}
              register={register}
              error={errors.telePhone}
              onChange={(e) => setValue('telePhone', e.currentTarget.value)}
            />

            <Input
              placeholder="(11) 00000-0000"
              mask={cellPhoneRegex}
              label={t('findClient.cellPhone')}
              name="cellPhone"
              value={getValues('cellPhone')}
              register={register}
              error={errors.cellPhone}
              onChange={(e) => setValue('cellPhone', e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />

        <div className="max-w-[130px] md:max-w-none w-full ">
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <DatePickerCustom
                label={t('findClient.dateOfBirth')}
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
            label={t('findClient.nationality')}
            name="nationality"
            register={register}
            error={errors.nationality}
          />
        </div>
        <div className="max-w-[298px] md:max-w-full">
          <Select
            placeholder={t('findClient.select')}
            options={optionsStatesOfBrazil}
            label={t('findClient.stateOfBirth')}
            name="stateOfBirth"
            register={register}
            error={errors.stateOfBirth}
            onChange={(e) => handleFetchCitiesData(e.target.value)}
          />
          <Select
            placeholder={t('findClient.select')}
            options={listCities}
            name="cityOfBirth"
            register={register}
            label={t('findClient.cityOfBirth')}
            error={errors.cityOfBirth}
          />
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
        <div className="max-w-[211px] md:max-w-full">
          <Select
            placeholder={t('findClient.select')}
            label={t('findClient.maritalStatus')}
            name="maritalStatus"
            register={register}
            options={maritalStatusOptions}
            error={errors.maritalStatus}
          />
          <Select
            placeholder={t('findClient.select')}
            options={genderOptions}
            label={t('findClient.gender')}
            name="gender"
            register={register}
            error={errors.gender}
          />
        </div>

        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
        <Button
          disabled={!selectedClientId}
          title={t('findClient.buttonAtt')}
          className="max-w-[140px]"
          variant="outline"
        />
      </form>
    </>
  )
}
