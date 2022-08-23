export const suggestSlug = (value:string) => {
  return value.replace(' ', '-').toLocaleLowerCase()
}
