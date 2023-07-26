import * as yup from 'yup'

export const clientSchema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  cpf: yup.string().required('O CPF é obrigatório'),
  rg: yup.string().required('O RG é obrigatório'),
  issuingBody: yup.string().required('O órgão emissor é obrigatório'),
  cellPhone: yup.string().required('O telefone celular é obrigatório'),
  telePhone: yup.string().required('O telefone é obrigatório'),
  dateOfBirth: yup.string().required('A data de nascimento é obrigatória'),
  nationality: yup.string().required('A nacionalidade é obrigatória'),
  stateOfBirth: yup.string().required('O estado de nascimento é obrigatório'),
  cityOfBirth: yup.string().required('A cidade de nascimento é obrigatória'),
  maritalStatus: yup.string().required('O estado civil é obrigatório'),
  gender: yup.string().required('O gênero é obrigatório'),
})
