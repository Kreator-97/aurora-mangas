import { Manga, Serie, User } from '../../interfaces'

const u = [
  {
    'id': '1868b938-1966-4fa8-bf56-aff6c6c959c9',
    'fullname': 'adrian gomez',
    'email': 'adriand@google.com',
    'password': '$2b$10$XI/wC3fRwAUGlVIfKdY6S.PddDUp.XpVjiEUAaek2YxjIgSqSG7AK',
    'imgURL': '/user/img',
    'role': 'USER',
    'createdAt': '1661352984880',
    'updatedAt': '1661352984880'
  },
  {
    'id': '2dc3ac10-b925-4add-977f-f5c15409f804',
    'fullname': 'super admin',
    'email': 'admin@admin.com',
    'password': '$2b$10$yI/dZeLL65ALgMYfTtRK5egD/hJyRi7o0VoQOC04C689kpDtWjl8C',
    'imgURL': '/user/img',
    'role': 'ADMIN',
    'createdAt': '1660934484119',
    'updatedAt': '1660934484122'
  },
]

export const users: User[] = u as User[]


export const series: Serie[] = [
  {
    'id': '2baea5fb-2fd2-41ff-bf8b-f64d247a23dd',
    'author': {
      'id': '5f45bd24-ef5c-47df-869e-ca8097942355',
      'name': 'Rumiko Takahashi'
    },
    'finished': true,
    'genre': 'ACTION, ADVENTURE, FANTASY, ROMANCE',
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751783/aurora-manga/covers/inuyasha_h295x9.jpg',
    'name': 'Inuyasha',
    'periodicy': 'MENSUAL',
    'isNewRelease': true,
    'sinopsis': 'InuYasha es el nombre de un demonio que en su día sellaron para que no provocara más problemas. Pero Kagome, fruto del destino, consigue atravesar la barrera mágica que separa el mundo actual con el de las guerras civiles, y quita el sello a Inu Yasha debido a la amenaza de cierto monstruo. Kagome posee la joya de las cuatro almas, que permite ganar gran poder, y ella será fruto del recelo de muchos monstruos en busca de ella. Pero la joya se ha roto en mil y un pedazos, e Inu Yasha y Kagome partirán en busca de todos los trozos de la joya.',
    'volumes': [],
    'slug': 'inuyasha'
  },
  {
    'id': '368852b4-62e7-449b-bd14-f6fd410037cc',
    'author': {
      'id': 'f4daa82f-e612-4313-ae4f-8d6debc2f9ac',
      'name': 'Eiichiro Oda'
    },
    'finished': true,
    'genre': 'ACCION',
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751788/aurora-manga/covers/one-piece_thiagp.jpg',
    'name': 'One Piece',
    'periodicy': 'MENSUAL',
    'isNewRelease': true,
    'sinopsis': 'La serie habla sobre un chico llamado Monkey D. Luffy, que fue abandonado por su padre y en su niñez obtuvo poderes elásticos al comer una Akuma no mi y ahora recorre los mares con el sueño de atravesar la Gran Línea una peligrosa barrera marina natural para llegar al One Piece, un lugar desconocido donde Gol D. Roger, difunto rey de los piratas, escondió un tesoro de proporciones inimaginables y que ha sido por décadas la aspiración de los más poderosos y peligrosos piratas, quienes hasta la actualidad no han llegado a obtenerlo.',
    'volumes': [],
    'slug': 'one-piece'
  },
  {
    'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
    'author': {
      'id': 'f215fd73-448c-4128-a9d0-ff4ed1ce837d',
      'name': 'Yusuke Murata'
    },
    'finished': false,
    'genre': 'ACCION',
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
    'name': 'One Punch Man',
    'periodicy': 'MENSUAL',
    'isNewRelease': false,
    'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
    'volumes': [],
    'slug': 'one-punch-man'
  },
  {
    'id': '9a4b8fa4-91cf-461f-a00c-efecfd3aae52',
    'author': {
      'id': '9b43c3b8-b506-4591-9707-f6ca6b993097',
      'name': 'Katsuhiro Otomo'
    },
    'finished': true,
    'genre': 'ACTION, MYSTERY, SOBRENATURAL',
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752048/aurora-manga/covers/akira_f83b1h.jpg',
    'name': 'Akira',
    'periodicy': 'BIMESTRAL',
    'isNewRelease': false,
    'sinopsis': 'A finales del siglo XX, el gobierno japonés ha decidido seleccionar a un grupo de niños para realizar unos tests secretos con el fin de explotar sus facultades parapsicológicas. Sin embargo, el experimento no ha salido como las autoridades deseaban y los niños se han convertido en una especie de mostruos que lo destrozan todo.',
    'volumes': [],
    'slug': 'akira'
  },
  {
    'id': '9b63b0dc-adcd-40b9-8584-cdd3338555e1',
    'author': {
      'id': '1e7816e3-d9e9-45f1-a964-a77f4269189c',
      'name': 'Yoshihiro Togashi'
    },
    'finished': false,
    'genre': 'ACTION, ADVENTURE',
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751856/aurora-manga/covers/hunterxhunter_jufvvz.jpg',
    'name': 'Hunter x Hunter',
    'periodicy': 'MENSUAL',
    'isNewRelease': false,
    'sinopsis': 'Gon se entera de que su padre, Ging, es un legendario cazador, un individuo que ha demostrado su valía, un miembro de elite de la humanidad y que se especializa en la búsqueda de criaturas raras, tesoros secretos y otras personas. A pesar de que Ging dejo su hijo a cuidado de sus familiares con el fin de perseguir sus propios sueños, Gon está decidido a seguir los pasos de su padre, aprobar el examen riguroso de Hunter, y finalmente, encontrar a su padre para convertirse en un cazador en su propio derecho. ',
    'volumes': [],
    'slug': 'hunter-x-hunter'
  }
]

export const mangas: Manga[] = [
  {
    'id': '02e7e70f-0d0d-43c2-86e6-34e75b7025e3',
    'number': '12',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751740/aurora-manga/mangas/one-punch-man/opman-12_cm7u9l.jpg',
    'published': '2022/09/01',
    'title': 'One punch man no.12',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata',
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man',
    }
  },
  {
    'id': '19fbddbe-2157-45e5-a58b-da2670a25bf8',
    'number': '8',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751740/aurora-manga/mangas/one-punch-man/opman-08_cublat.jpg',
    'published': '2022/05/01',
    'title': 'one punch man no.8',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  },
  {
    'id': '20bcecfd-5599-4027-921a-ab4e544875a8',
    'number': '5',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751739/aurora-manga/mangas/one-punch-man/opman-05_ggyfvd.jpg',
    'published': '2022/02/01',
    'title': 'One punch man no.5',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  },
  {
    'id': '21299faf-231f-48e1-9e54-975ce7d68716',
    'number': '2',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751740/aurora-manga/mangas/one-punch-man/opman-02_viieky.jpg',
    'published': '2021/11/01',
    'title': 'One punch man no.2',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  },
  {
    'id': '2711e383-e7d3-4169-bd29-e7bb98f7375c',
    'number': '1',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751739/aurora-manga/mangas/one-punch-man/opman-01_rlozl9.jpg',
    'published': '2021/10/01',
    'title': 'One punch man no.1',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  },
  {
    'id': '3c5fdf37-ea75-4cad-a701-d7ec98edbaa2',
    'number': '10',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751741/aurora-manga/mangas/one-punch-man/opman-10_oci7rn.jpg',
    'published': '2022/07/01',
    'title': 'One punch man no.10',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  },
  {
    'id': '51755e4c-9523-4c68-80fb-cee7dd080fe8',
    'number': '7',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751740/aurora-manga/mangas/one-punch-man/opman-07_pvnepc.jpg',
    'published': '2022/04/01',
    'title': 'One punch man no.7',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  },
  {
    'id': '8996f64d-5e5d-45bd-8041-acc331e47e10',
    'number': '4',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751741/aurora-manga/mangas/one-punch-man/opman-04_m8zfmb.jpg',
    'published': '2022/01/01',
    'title': 'One punch man no.4',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  },
  {
    'id': 'c3d1c41a-38a0-4245-bdb4-8b680fe4d917',
    'number': '11',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751740/aurora-manga/mangas/one-punch-man/opman-11_mc46fj.jpg',
    'published': '2022/08/01',
    'title': 'One punch man no.11',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  },
  {
    'id': 'c6d9a827-9f89-431a-b29f-ce9714cf8a40',
    'number': '9',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751739/aurora-manga/mangas/one-punch-man/opman-09_e9mo1o.jpg',
    'published': '2022/06/01',
    'title': 'One punch man no.9',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  },
  {
    'id': 'd03805c0-2f4a-468b-91aa-4997d6d44923',
    'number': '3',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751740/aurora-manga/mangas/one-punch-man/opman-03_cxwejh.jpg',
    'published': '2021/12/01',
    'title': 'One punch man no.3',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  },
  {
    'id': 'dd6e8fa8-a111-4758-8b52-b1e2329dace6',
    'number': '6',
    'price': 99,
    'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660751741/aurora-manga/mangas/one-punch-man/opman-06_c05bci.jpg',
    'published': '2022/03/01',
    'title': 'One punch man no.6',
    'serie': {
      'id': '543e5b82-6441-428e-b1c6-4c35db75d17b',
      'author': {
        'id': '001',
        'name': 'Yusuke Murata'
      },
      'volumes': [],
      'finished': false,
      'genre': 'ACCION',
      'imgURL': 'https://res.cloudinary.com/kreator/image/upload/v1660752043/aurora-manga/covers/one-punch-man_p4kd4j.jpg',
      'name': 'One Punch Man',
      'periodicy': 'MENSUAL',
      'isNewRelease': false,
      'sinopsis': '¡Sigue la vida de un héroe promedio que gana todas sus peleas con un solo puño! Esto es causa de un montón de frustración y ahora ya no se siente la adrenalina y la emoción de una dura pelea. Tal vez ese riguroso entrenamiento para volverse fuerte no valió la pena. Después de todo, ¿qué tiene de bueno tener un poder tan aplastante? ',
      'slug': 'one-punch-man'
    }
  }
]
