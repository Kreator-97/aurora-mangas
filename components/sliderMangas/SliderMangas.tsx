import { FC, useRef } from 'react'
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi'

import { Manga } from '../../interfaces'
import { CardManga } from '../cardManga'

interface Props {
  mangas: Manga[]
}

const minCardWidth = 230

export const SliderMangas: FC<Props> = ({mangas}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const onScrollLeft = () => {
    const clientWidth = scrollRef.current?.clientWidth
    const offset = (clientWidth ? clientWidth - (minCardWidth / 2) : minCardWidth) * -1
    scrollRef.current!.scrollBy( offset, 0)
  }

  const onScrollRight = () => {
    const clientWidth = scrollRef.current?.clientWidth
    scrollRef.current?.scrollBy(clientWidth ? clientWidth - (minCardWidth / 2) : minCardWidth, 0)
  }

  return (
    <section className='px-4 relative justify-center'>
      <h2 className='text-center text-xl mb-2'>{mangas.length} Mangas</h2>
      <div
        className={`
          ${mangas.length === 1 ? 'flex justify-center' : 'grid grid-cols-1' }
          sm:grid-cols-2 gap-4 w-full max-w-[var(--max)] px-1
          md:flex md:overflow-y-scroll
          md:${mangas.length < 3 ? 'justify-center' : 'justify-start'}
          lg:${mangas.length < 5 ? 'justify-center' : 'justify-start' }
        `}
        ref={scrollRef}
        style={{
          scrollBehavior: 'smooth',
        }}
      >
        {
          mangas.map((manga) => {
            return (
              <CardManga key={manga.id} manga={manga}/>
            )
          })
        }
      </div>
      <div
        className='bg-white absolute left-0 top-1/2 rounded-full hidden md:block'
      >
        <HiArrowCircleLeft
          size={28}
          onClick={() => onScrollLeft() }
          fill={'var(--accent)'}
          color="#fff"
          cursor="pointer"
          style={{ transform: 'scale(2)'}}
          stroke="var(--dark)"
          strokeWidth={.5}
          strokeOpacity={.5}
          data-testid="scroll-left-icon"
        />
      </div>
      <div
        className='bg-white absolute right-0 top-1/2 rounded-full hidden md:block'
      >
        <HiArrowCircleRight
          size={28}
          onClick={() => onScrollRight() }
          fill={'var(--accent)'}
          cursor="pointer"
          style={{ transform: 'scale(2)'}}
          className="shadow-inner"
          stroke="var(--dark)"
          strokeWidth={.5}
          strokeOpacity={.3}
          data-testid="scroll-right-icon"
        />
      </div>
    </section>
  )
}
