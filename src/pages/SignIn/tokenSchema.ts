import * as yup from 'yup'

export const signInSchema = yup.object().shape({
  email: yup.string().email().required('E-mail é obrigatório'),
  password: yup.string().required('Senha é obrigatório'),
})
