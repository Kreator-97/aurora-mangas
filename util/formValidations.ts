
const CLOUDINARY_DOMAIN = 'https://res.cloudinary.com'

export const validations = {
  noEmptyString: {
    validation: (value:string) => value.trim() !== '',
    message: 'Este campo no puede estar vacio',
  },
  mustToBeCloudinaryImgURL: {
    validation: (value:string) => value.trim() !== '' && value.startsWith(CLOUDINARY_DOMAIN) ,
    message: 'Este campo debe de ser una URL de Cloudinary válida',
  },
  isValidNumber: {
    validation: (value: string) => ( !isNaN(Number(value)) ) && (Number(value) >= 0),
    message: 'Este campo debe de ser un número válido',
  },
}
