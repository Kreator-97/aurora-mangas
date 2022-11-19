import { FC, useState } from 'react'

interface Props {
  totalPages    : number;
  initialPage  ?: number;
  onPageChange ?: (page:number) => void;
}

const maxPagesToShow = 9
const offset = 4

export const Pagination: FC<Props> = ({totalPages, initialPage, onPageChange}) => {
  const [ currentPage, setCurrentPage ] = useState<number>(initialPage || 1)
  const minPageToShow = Math.max(currentPage - offset, 1)

  let diffToAddPages = 0

  if ( currentPage + offset > totalPages ) {
    diffToAddPages = ( currentPage - totalPages ) + offset
  }

  const newInitialPageToShow = Math.max( minPageToShow - diffToAddPages, 1 )

  const pages: number[] = []
  for(let i = newInitialPageToShow; i <= totalPages; i++ ) {
    if( pages.length >= maxPagesToShow ) break
    pages.push(i)
  }

  const onPageChangeEvent = (page:number) => {
    const newPage = page === 1 ? 1 : page 
    setCurrentPage(newPage)
    onPageChange && onPageChange(newPage)
  }

  return (
    <div className='mx-auto my-2 flex gap-2 justify-center'>
      {
        pages.map((p, index) => {
          const page = index === 0 ? 1 : p

          return (
            <button
              className={`text-xl py-1 rounded bg-accent ${p === currentPage ? 'active' : ''}`}
              key={`page-${page}`}
              onClick={ () => onPageChangeEvent(page) }
              data-testid="btn-page"
            >
              <span className='w-9 block'>
                {page}
              </span>
            </button>
          )
        })
      }
    </div>
  )
}
