import { FC, useState } from 'react'

interface Props {
  totalPages: number;
}

export const Pagination: FC<Props> = ({totalPages}) => {
  const [ currentPage, setCurrentPage] = useState<number>(1)
  // page init to 1

  let minPage = 1
  const maxPages = 9
  // we show 9 elements

  let initialOffset = 4
  // this show pages computing its offset. Example:
  // current page = 10
  // minpage = 10 - 4 = 6
  // maxpage = minpage + (offset * 2) = 14

  let diff = 0
  // diff is the result of totalpages - currentpage. Example
  // 20 - 18 = -2
  // we add ABS(-2) to offset left (min page) to show always 9 pages in pagination

  if( (totalPages - currentPage) < initialOffset ) {
    diff = Math.abs((totalPages - (currentPage + initialOffset)))
  }

  if( currentPage > initialOffset ) {
    minPage = (currentPage - initialOffset) - diff
  }

  const pages = []
  for( let i = minPage; i <= totalPages; i++ ) {
    if( pages.length >= maxPages) continue
    pages.push(i)
  }

  return (
    <div className='mx-auto my-2 flex gap-2 justify-center'>
      {
        pages.map((p, index) => {
          const page = index === 0 ? 1 : minPage
          if( page > totalPages) return <></>
          minPage++
          return (
            <button
              className={`text-xl py-1 rounded bg-accent ${p === currentPage ? 'active' : ''}`}
              key={`page-${page}`}
              onClick={ () => setCurrentPage(page === 1 ? 1 : page) }
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
