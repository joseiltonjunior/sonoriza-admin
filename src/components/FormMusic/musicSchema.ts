import * as yup from 'yup'

export const musicSchema = yup.object().shape({
  url: yup.string().required('A URL é obrigatória'),
  title: yup.string().required('O título é obrigatório'),
  artists: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required('O ID do artista é obrigatório'),
        name: yup.string().required('O nome do artista é obrigatório'),
        photoURL: yup
          .string()
          .required('A URL da foto do artista é obrigatória'),
        musics: yup
          .array()
          .of(yup.string())
          .required('A lista de músicas do artista é obrigatória'),
      }),
    )
    .required('A lista de artistas é obrigatória'),
  genre: yup.string().required('O gênero é obrigatório'),
  album: yup.string().required('O álbum é obrigatório'),
  artwork: yup.string().required('A URL da capa do álbum é obrigatória'),
  color: yup.string().required('A cor é obrigatória'),
})
