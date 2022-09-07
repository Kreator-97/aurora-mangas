import { FC } from 'react'

interface Props {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}

export const Modal:FC<Props> = ({title, children, isOpen}) => {  

  return (
    <div
      className="fixed top-32 left-1/2 max-w-[480px] bg-light z-50 p-4 rounded transition-transform"
      style={{
        transform: isOpen ? 'translate(-50%, 0)' : 'translate(-50%, -200%)'
      }}
    >
      <h2 className="text-center text-xl text-dark">{title}</h2>
      {
        children
      }
    </div>
  )
}
