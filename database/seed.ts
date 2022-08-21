import { Serie } from '../interfaces'

export const series:Serie[] = [
  {
    name: 'Hunter x Hunter',
    imgURL: 'https://res.cloudinary.com/kreator/image/upload/v1660751856/aurora-manga/covers/hunterxhunter_jufvvz.jpg',
    periodicy: 'MENSUAL',
    volumes: [
      {
        author: 'Yoshihiro Tagashi',
        number: '1',
        price: 99,
        serie: 'Hunter x Hunter',
        imgURL: 'https://res.cloudinary.com/kreator/image/upload/v1660751606/aurora-manga/mangas/hunter-x-hunter/hxh-01_ckzr9t.jpg',
        published: '2020/01/01',
        id: '001',
      }
    ],
    genre: ['ADVENTURE', 'FANTASY', 'MARTIAL_ARTS'].join(', '),
    finished: false,
    sinopsis: 'Gon se entera de que su padre, Ging, es un legendario cazador, un individuo que ha demostrado su valía, un miembro de elite de la humanidad y que se especializa en la búsqueda de criaturas raras, tesoros secretos y otras personas. A pesar de que Ging dejo su hijo a cuidado de sus familiares con el fin de perseguir sus propios sueños, Gon está decidido a seguir los pasos de su padre, aprobar el examen riguroso de Hunter, y finalmente, encontrar a su padre para convertirse en un cazador en su propio derecho.',
    author: {
      name: 'Yoshihiro Togashi',
      birthDate: '1967/04/27'
    },
    id: '001'
  },
  {
    name: 'Inuyasha',
    author: {
      name: 'Rumiko Takahashi',
      birthDate: '1957/10/10'
    },
    finished: true,
    genre: ['ADVENTURE', 'ROMANCE'].join(', '),
    imgURL: 'https://res.cloudinary.com/kreator/image/upload/v1660751783/aurora-manga/covers/inuyasha_h295x9.jpg',
    periodicy: 'BIMESTRAL',
    volumes: [],
    sinopsis: 'Durante el periodo Sengoku, un hanyo llamado InuYasha había robado la perla de las cuatro almas (la Perla de Shikon) con el objetivo de convertirse en un yokai completo, sin embargo, su plan es frustrado debido a que una sacerdotisa llamada Kikyo, utilizando sus últimas fuerzas, le disparó una flecha sagrada, clavándolo en el árbol Goshinboku (de las eras), dejándolo paralizado y dormido por los posteriores cincuenta años mientras que la sacerdotisa, antes de morir, había pedido que su cuerpo fuera quemado junto con la joya.',
    id: '002'
  },
  {
    name: 'One Piece',
    imgURL: 'https://res.cloudinary.com/kreator/image/upload/v1660751788/aurora-manga/covers/one-piece_thiagp.jpg',
    periodicy: 'MENSUAL',
    volumes: [],
    genre: ['ADVENTURE', 'ACTION'].join(', '),
    finished: false,
    author: {
      name: 'Eichiro Oda',
      birthDate: '1975/1/1'
    },
    sinopsis: 'One Piece es una aventura de piratas. Es la historia de un chico llamado Monkey D. Luffy, quien cuando tenía 7 años comió accidentalmente una Fruta del Diablo, convirtiéndose en un hombre de goma aunque al precio de hacerle incapaz de nadar. Luffy, inspirado por el pirata Shanks "Akagami", sale al mar diez años después para convertirse en el Rey de los Piratas. Para ello necesitaría encontrar una tripulación adecuada, diez personas que lo acompañarían en su aventura. Dicho título honorífico nacería con la leyenda del pirata Gol D. Roger, conocido junto a su tripulación como los únicos capaces de la hazaña de recorrer por completo la Grand Line 22 años antes del inicio del viaje de Luffy.',
    id: '003'
  },
]
