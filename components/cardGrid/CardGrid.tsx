import { FC } from 'react'
import { Serie } from '../../interfaces'

import { CardSuscribe } from '../'

interface Props {
  series    ?: Serie[];
  children  ?: React.ReactNode;
  gridCols ?: string;
}

export const CardGrid: FC<Props> = ({ series, children, gridCols }) => {
  let gridDefault = 'grid-cols-1 md:grid-cols-2'

  if( gridCols ) {
    gridDefault = gridCols
  }

  return (
    <div className={ `grid gap-2 ${gridDefault}` }>
      {
        series?.map(({ name, periodicy, imgURL }) =>(
          <CardSuscribe
            key={name}
            imgURL={imgURL}
            periodicy={periodicy}
            serie={name}
          />
        ))
      }
      { children }
    </div>
  )
}
