import { FC } from 'react'
import { Serie } from '../../interfaces'

import { CardSerie } from '../'

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
    <div
      className={ `grid gap-2 ${gridDefault} px-2` }
      data-testid="card-serie"
    >
      {
        series?.filter((serie) => serie.isNewRelease === true).map((serie) =>(
          <CardSerie
            key={serie.name}
            serie={serie}
          />
        ))
      }
      { children }
    </div>
  )
}
