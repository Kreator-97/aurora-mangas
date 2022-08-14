import Image from 'next/image'

export const Footer = () => {
  return (
    <div
      className="min-h-[150px] border-t border-solid border-stroke"
    >
      <h2
        className="text-2xl md:text-3xl text-center p-4">
        Siguenos en nuestras redes sociales
      </h2>
      <div className='flex justify-center gap-8'>
        <Image
          src="/images/social/facebook.svg"
          width={60}
          height={60}
          layout="fixed"
        />
        <Image
          src="/images/social/twitter.svg"
          width={64}
          height={64}
          layout="fixed"
        />
      </div>
    </div>
  )
}
