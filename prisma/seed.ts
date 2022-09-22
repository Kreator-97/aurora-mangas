import prisma from '../lib/prisma'
import bcrypt from 'bcrypt'

async function main() {

  await prisma.address.deleteMany()
  await prisma.item.deleteMany(),
  await prisma.order.deleteMany(),
  await prisma.user.deleteMany(),
  await prisma.manga.deleteMany(),
  await prisma.serie.deleteMany(),

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@admin.com',
        fullname: 'Super Admin',
        password: bcrypt.hashSync('123456', 10),
        role: 'ADMIN'
      },
      {
        email: 'user@user.com',
        fullname: 'User Test',
        password: bcrypt.hashSync('123456', 10),
        role: 'USER'
      },
    ]
  })

  await prisma.author.createMany({
    data: [
      {
        name: 'Yusuke Murata',
      },
      {
        name: 'Rumiko Takahashi',
      },
      {
        name: 'Eichiro Oda',
      },
    ]
  })

  const authors = await prisma.author.findMany()

  const YusukeMurata = authors.find((a) => a.name === 'Yusuke Murata' )
  const RumikoTakahashi = authors.find((a) => a.name === 'Rumiko Takahashi' )
  const EichiroOda = authors.find((a) => a.name === 'Eichiro Oda' )

  await prisma.serie.createMany({
    data: [
      {
        authorId: YusukeMurata!.id,
        finished: false,
        genre: 'ACTION, COMEDY',
        imgURL: 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
        name: 'One punch man',
        sinopsis: '',
        slug: 'one-punch-man',
        isNewRelease: false,
        periodicy: 'MENSUAL',
        totalVolumes: 20,
        unitPrice: 99,
      },
      {
        authorId: RumikoTakahashi!.id,
        finished: true,
        genre: 'ACTION, COMEDY, ROMANCE',
        imgURL: 'https://res.cloudinary.com/kreator/image/upload/v1660751783/aurora-manga/covers/inuyasha_h295x9.jpg',
        name: 'Inuyasha',
        sinopsis: '',
        slug: 'inuyasha',
        isNewRelease: true,
        periodicy: 'MENSUAL',
        totalVolumes: 29,
        unitPrice: 139,
        paypalPlanId: 'P-5V617341NT567532TMMNGARQ'
      },
      {
        authorId: EichiroOda!.id,
        finished: false,
        genre: 'ACTION, COMEDY, ADVENTURES',
        imgURL: 'https://res.cloudinary.com/kreator/image/upload/v1660751788/aurora-manga/covers/one-piece_thiagp.jpg',
        name: 'One Piece',
        sinopsis: '',
        slug: 'one-piece',
        isNewRelease: true,
        periodicy: 'MENSUAL',
        totalVolumes: 103,
        unitPrice: 99,
        paypalPlanId: 'P-0VV65606FG5750543MMNJJRY'
      },
    ]
  })

  const onePunchMan = await prisma.serie.findUnique({where: { slug: 'one-punch-man' }})

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]

  await prisma.manga.createMany({
    data: numbers.map((n) => {
      return (
        {
          serieId: onePunchMan!.id,
          imgURL: 'https://res.cloudinary.com/kreator/image/upload/v1660751739/aurora-manga/mangas/one-punch-man/opman-01_rlozl9.jpg',
          number: n,
          price: 99,
          published: `2021/${n}/01`,
          title: `One punch man no.${n}`,
          stock: 20,
        })
    })
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async() => {
    await prisma.$disconnect()
  })
