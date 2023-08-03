import * as yup from 'yup'

export const tokenSchema = yup.object().shape({
  token: yup.string().required('O token é obrigatório'),
})
