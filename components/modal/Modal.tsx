import { FC } from 'react'
import { IoIosCloseCircle } from 'react-icons/io'

interface Props {
  title   : string;
  children: React.ReactNode;
  isOpen? : boolean;
  onClose?: () => void;
}

export const Modal:FC<Props> = ({title, children, isOpen, onClose}) => {

  const onCloseEvent = () => {
    onClose && onClose()
  }

  return (
    <div
      className="fixed top-32 left-1/2 max-w-[480px] bg-light z-50 pt-6 p-4 rounded transition-transform"
      style={{
        transform: isOpen ? 'translate(-50%, 0)' : 'translate(-50%, -200%)'
      }}
    >
      <div className='flex justify-end absolute top-1 right-1'>
        <IoIosCloseCircle color='var(--dark)' size={24} cursor="pointer" onClick={() => onCloseEvent()}/>
      </div>
      <h2 className="text-center text-xl text-dark">{title}</h2>
      {
        children
      }
    </div>
  )
}
