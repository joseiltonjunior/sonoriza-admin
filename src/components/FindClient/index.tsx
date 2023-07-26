import { useState } from 'react'
import { Button } from '../Button'
import { Select } from '../Select'
import { Input } from '../Input'
import { useForm } from 'react-hook-form'
import { ClientProps } from '@/types/client'

import { yupResolver } from '@hookform/resolvers/yup'
import { clientSchema } from './clientSchema'

export function FindClient() {
  const {
    register,
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

  const options = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
  ]

  const [selectedOption, setSelectedOption] = useState('')

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedOption(event.target.value)
  }

  function submit(data: ClientProps) {
    console.log(data)
  }

  return (
    <div className="bg-white rounded-2xl p-7 mt-8 top-5">
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
            onChange={handleChange}
            options={options}
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
              // mask="999.999.999-99"
              label="CPF"
              name="cpf"
              register={register}
              error={errors.cpf}
            />

            <Input
              placeholder="34.420.078-0"
              label="IE/RG"
              name="rg"
              register={register}
              error={errors.rg}
            />

            <Input
              placeholder="SSP"
              label="Órgão emissor"
              name="issuingBody"
              register={register}
              error={errors.issuingBody}
            />
          </div>

          <div className="grid md:grid-cols-1 grid-cols-[150px,150px] gap-4">
            <Input
              placeholder="(11) 0000-0000"
              label="Telefone"
              name="telePhone"
              register={register}
              error={errors.telePhone}
            />

            <Input
              placeholder="(11) 00000-0000"
              label="Celular"
              name="cellPhone"
              register={register}
              error={errors.cellPhone}
            />
          </div>
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
        <div className="max-w-[130px] md:max-w-full">
          <Input
            placeholder="17/04/1995"
            label="Data de nascimento"
            name="dateOfBirth"
            register={register}
            error={errors.dateOfBirth}
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
            options={options}
            label="Estado de nascimento"
            name="stateOfBirth"
            register={register}
            error={errors.stateOfBirth}
          />
          <Select
            placeholder="Selecione"
            options={options}
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
            options={options}
            error={errors.maritalStatus}
          />
          <Select
            placeholder="Selecione"
            options={options}
            label="Sexo"
            name="gender"
            register={register}
            error={errors.gender}
          />
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
        <Button title="Atualizar" className="max-w-[140px]" variant="outline" />
        <div className="h-[1px] bg-gray-300/50 my-7 max-w-[598px] md:max-w-full" />
        <div className="flex gap-4">
          <Button
            title="Continuar"
            className="max-w-[140px]"
            variant="green"
            type="button"
          />
          <button
            className="text-blue-600 underline text-sm font-bold hover:text-blue-600/90"
            type="button"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  )
}
