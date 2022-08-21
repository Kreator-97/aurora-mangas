import React from 'react'

import styles from './Table.module.css'

interface Props {
  columns: string[];
  children?: React.ReactNode;
}

export const Table = ({columns, children}:Props) => {
  
  return (
    <table className={ styles.table }>
      <thead>
        <tr>
          {
            columns.map((col) => {
              return (
                <th key={col}>{col}</th>
              )
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          children
        }
      </tbody>
    </table>
  )
}

interface RowProps extends React.TableHTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

const TableRow = ({children, id}:RowProps) => {
  return (
    <tr id={id}>
      { children }
    </tr>
  )
}

interface Cell {
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
}

const TableCell = ({children, colSpan, rowSpan}:Cell) => {
  return (
    <td colSpan={colSpan} rowSpan={rowSpan} >
      { children }
    </td>
  )
}

Table.Row = TableRow
Table.Cell = TableCell
