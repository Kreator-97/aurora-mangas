export const suggestSlug = (value:string):string => {
  if(value === '') return ''
  
  const res = value.replaceAll(' ', '-').replaceAll('_','-').toLocaleLowerCase()
  let removed = 1
  // removed is a value that is util for check the previous value 
  return res.split('').reduce((acc, el, i) => {
    if (i === 0) return acc+el

    if( el === '-' && acc[i-removed] === '-' ) {
      removed++
      return acc
    } 
    return acc + el
  }, '')
}
