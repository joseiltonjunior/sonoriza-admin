import { ClientProps } from '@/types/client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface FormData extends ClientProps {}

interface FormContextData {
  formData: ClientProps
  updateFormData: (data: ClientProps) => void
}

const FormContext = createContext<FormContextData | undefined>(undefined)

interface FormProviderProps {
  children: ReactNode
}

export function FormProvider({ children }: FormProviderProps) {
  const [formData, setFormData] = useState<FormData>({
    stateOfBirth: '',
    gender: '',
    maritalStatus: '',
    cellPhone: '',
    cityOfBirth: '',
    cpf: '',
    dateOfBirth: '',
    issuingBody: '',
    name: '',
    nationality: '',
    rg: '',
    telePhone: '',
  })

  const updateFormData = (data: FormData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }))
  }

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  )
}

export function useFormContext(): FormContextData {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }
  return context
}
