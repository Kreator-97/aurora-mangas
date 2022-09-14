import { FC, useEffect, useRef, useState } from 'react'
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi'

import { Manga } from '../../interfaces'
import { CardManga } from '../cardManga'
import styles from './SliderMangas.module.css'

interface Props {
  mangas: Manga[]
}

const minCardWidth = 225
const gap = 16

export const SliderMangas: FC<Props> = ({mangas}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [ itemsPosition, setItemsPosition ] = useState<'center' | 'flex-start'>('center')
  const [ showArrows, setShowArrows ] = useState<boolean>(true)

  const onScrollLeft = () => {
    const clientWidth = scrollRef.current?.clientWidth
    const offset = (clientWidth ? clientWidth - (minCardWidth / 2) : minCardWidth) * -1
    scrollRef.current!.scrollBy( offset, 0)
  }

  const onScrollRight = () => {
    const clientWidth = scrollRef.current?.clientWidth
    scrollRef.current?.scrollBy(clientWidth ? clientWidth - (minCardWidth / 2) : minCardWidth, 0)
  }

  const computePosition = () => {
    const currentWidth = (minCardWidth * mangas.length + mangas.length * gap)
    const position = currentWidth > (scrollRef.current?.clientWidth || 0)
      ? 'flex-start'
      : 'center'
    setItemsPosition(position)
  }

  const computeShowArrows = () => {
    const currentWidth = (minCardWidth * mangas.length + mangas.length * gap)
    const showArrows = currentWidth > (scrollRef.current?.clientWidth || 0)
    setShowArrows(showArrows)
  }

  useEffect(() => {
    computePosition()
    computeShowArrows()
  }, [mangas]) // eslint-disable-line

  useEffect(() => {
    const resizeEvent = () => {
      computePosition()
      computeShowArrows()
    }

    window.addEventListener('resize', resizeEvent)
    return () => {
      window.removeEventListener('resize', resizeEvent)
    }
  }, []) // eslint-disable-line

  return (
    <section className='px-4 relative justify-center'>
      <h2 className='text-center text-xl mb-2'>{mangas.length} Mangas</h2>
      <div
        className={`${styles.content} ${mangas.length === 1 ? `${styles['single-element']}` : ''}`}
        ref={scrollRef}
        style={{
          scrollBehavior: 'smooth',
          justifyContent: itemsPosition,
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
        className={`bg-white absolute left-0 top-1/2 rounded-full hidden md:${showArrows ? 'block' : 'hidden'}`}
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
        className={`bg-white absolute right-0 top-1/2 rounded-full hidden md:${showArrows ? 'block' : 'hidden'}`}
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
