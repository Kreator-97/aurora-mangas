## Aurora Mangas 
Es un ecommerce especializado en la ventas y distribución de Mangas en español.

Consigue tus títulos de Mangas favoritos de forma rápida y segura:

Contamos con titulos muy populares:
- Hunter x Hunter 
- One piece
- Berserk
- Saint seiya
- Inuyasha
- Akira

Entre muchos otros

## Pagos rápidos y seguros
Utilizamos paypal como agente de pagos para procesar y verificar tus compras de forma rápida y segura.

## Realizado con las siguientes herramientas 
- TypeScript
- React
- Nextjs
- Tailwind.css
- Prisma
- MySQL
- GraphQL
- Redux Toolkit

También con mucho 🧡 y 🔥.

## Iniciar proyecto
Para descargar las dependencias ejecuta
```bash
yarn install
```

Recuerda antes declarar las variables de entorno que se encuentran en el archivo `.env.example`, cuales deben de estar en los siguientes archivos
- .env
- .env.test: para test


Para crear la base de datos usando docker ejecuta:
```bash
docker compose up -d
```

### Carga schema en la base de datos

Para hacer una migración o inicialización del `schema.prisma` a la base de datos ejecuta:
```
yarn migrate
```

Si por alguna razón los datos de prueba no han sido sembrados en DB puedes ejecutar el siguiente comando:
```bash
npx prisma db seed
```

Esto carga unos datos de prueba para comenzar a trabajar. Verifica este archivo en `/prisma.seed.ts`. Si en caso de fallo reintentar con el mismo comando.

Para iniciar el servidor de desarrollo ejecuta:
```bash
yarn dev
```

## Testing
Para ejecutar las pruebas primero inicializa la base de datos de prueba con el siguiente comando:
```
yarn migrate-test
```

Para correr las pruebas primero inicia el servidor de desarrollo con el siguiente comando:
```
yarn server-test
```

Para ejecutar las pruebas ejecuta:
```
yarn test
```