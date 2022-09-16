import Image from 'next/image'

export const Footer = () => {
  return (
    <footer
      className="min-h-[150px] border-t border-solid border-stroke"
    >
      <h2
        className="text-xl md:text-3xl text-center p-4 mt-8">
        Síguenos en nuestras redes sociales
      </h2>
      <div className='flex justify-center gap-8'>
        <Image
          src="/images/social/facebook.svg"
          width={32}
          height={32}
          layout="fixed"
          alt='facebook'
        />
        <Image
          src="/images/social/twitter.svg"
          width={36}
          height={36}
          layout="fixed"
          alt='twitter'
        />
      </div>
    </footer>
  )
}
