# FRIGOHACKS

Hecho con Laravel 11
<p align=""><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="200" alt="Laravel Logo"></a> 
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>


# Sobre el proyecto

FrigoHacks es un proyecto nacido de la necesidad de gestionar los recursos de la nevera eficeintemente. 

FrigoHacks esta compuesto de 3 cosas:
- Un sistema de gestión de nevera en un servidor web con una API REST y una interfaz web.
- Una aplicación móvil que se conecta a la API REST para gestionar la nevera.
- Un sistema de autenticacion fisible con una ESP32, un lector RFID y un pinpad.


# Requisitos
- Servidor web (Apache, Nginx, etc)
- PHP 8.3
- Composer
- NodeJS 22
- NPM
- Base de datos (MySQL, PostgreSQL, SQLite, etc)
- Lector RFID (PN532)
- ESP32
- Pinpad 4x4
- Pantalla LCD 16x2
- Arduino IDE

# Tecnologías
- Laravel 11
- VueJS
- React
- TailwindCSS
- Arduino


# Rutas de la aplicación
- `/app/Controllers` - Controladores de la aplicación que gestionan las peticiones HTTP
- `/app/Models` - Modelos de la aplicación (Que se conectan a la base de datos. Mirar Eloquent ORM y la documentación de Laravel sobre los modelos)
- `/routes/api.php` - Rutas de la API REST que se conectan a los controladores
- `/database/migrations` - Estrucutra de la base de datos para migrar
- `/database/seeders` - Seeders para poblar la base de datos
- `/resources/js` - Archivos de React y VueJS para la interfaz web (frontend)
- `/public/arduino` - Archivos del código de Arduino para la ESP32 y diagramas de conexión

# Instalación
- Instalar las dependencias con `sudo apt install composer php8.3 php8.3-cli php8.3-mbstring php8.3-xml php8.3-mysql php8.3-pgsql php8.3-sqlite3 php8.3-curl php8.3-zip php8.3-gd php8.3-xml php8.3-dom`

- Ir a la carpeta /var/www (o donde hostearas la pagina) con `cd /var/www`
- Clonar el repositorio con git `git clone https://github.com/Hackerspace-Castellon/FrigoHacks.git`
- Ir a la carpeta del proyecto con `cd FrigoHacks`

- Instalar las dependencias con composer `composer install`

- Copia el archivo .env.example a .env y modifica las variables de entorno `cp .env.example .env`
- Ejecuta `php artisan key:generate` para generar una clave de aplicación

- Modifica e introduce la ip de tu lector RFID en el archivo .env en `ESP32_IP=<Tu_IP>`

- Modifica en el archivo `.env` las siguientes variables:
    - APP_URL=<URL_De_Tu_Aplicación>
    - ALLOWED_EMAILS=<Emails_De_Usuarios_Autorizados> (Separados por coma \[fran@hackcs.com, alberto@gmail.com, etc\])
    - ALLOWED_ORGANIZATIONS_EMAILS=<Emails_De_Usuarios_Autorizados_De_La_Organización> (Separados por coma \[hackcs.com, gmail.com, hotmail.com, etc\])

- Pon en true la variable `ALWAYS_EQUAL_FRIDGE_TO_STOCK` del archivo `.env` si quieres que la nevera siempre tenga la misma cantidad de productos que el total del producto.

- Modifica los datos de la base de datos en el archivo `.env` para que coincidan con tu base de datos
    - DB_CONNECTION=<Tu_Motor_De_DB> (mysql, pgsql, sqlite, etc)
    - DB_HOST= <Tu_IP_De_LA_BASE_DE_DATOS> 
    - DB_PORT= <Puerto_De_Tu_Base_De_Datos> (Pord defecto 3306 en MySQL y 5432 en PostgreSQL)
    - DB_USERNAME= <Tu_Usuario_De_Base_De_Datos>
    - DB_PASSWORD= <Tu_Contraseña_De_Base_De_Datos>


- Modifica en el archivo `.env` las siguientes variables si quieres iniciar sesion con tu organización de Google
    - GOOGLE_CLIENT_ID=<Tu_Client_ID>
    - GOOGLE_CLIENT_SECRET = <Tu_Client_Secret>
    - GOOGLE_REDIRECT_URI = <Tu_Redirect_URI>
    - Tutoarial aqui: https://developers.google.com/identity/protocols/oauth2


- Para la autenticación debes configurar en el archivo `.env` las siguientes variables:
    - SESSION_DOMAIN = <Tu_Dominio> (Debe ser .<Tu_Dominio> para que funcione, sin rutas ni puertos)
    - SANCTUM_STATEFUL_DOMAIN = <Tu_Dominio> (Donde estara el frontend)


- Asegurate que la base de datos frigohacks existe en tu base de datos y que el usuario tiene permisos para acceder a ella
- Migrar la base de datos con `php artisan migrate`


- Modificar en el archivo `src/config-global` la variable `appUrl` con el URL de tu servidor
- Instala las dependencias de node `npm install` (Puedes usar bun, yarn o cualquier otro gestor de paquetes)
- Genera las paginas con `npm run build`
- Copiar el contenido de la carpeta `dist` a la carpeta `public` de tu servidor con `cp -r dist/* public/`


##### Compilar el codigo para Android o iOS
- Para compilar el código usaremos capacitor
- Init capacitor con `npx cap init`
- Añadir la plataforma con `npx cap add android` o `npx cap add ios`
- Preparar el código con `bun run build` y luego `npx cap sync`
- Compilar el código con AndroidStudio `npx cap open android` o  XCode `npx cap open ios`

# Pruebas
- Para ejecutar el servidor en local, ejecuta `php -S 0.0.0.0:8000 -t public/` desde la carpeta raíz de la aplicación
- Para ejecutar las pruebas de la aplicación, ejecuta `php artisan test`



# Endpoints para la App de Gestión de Nevera

## Autenticación

| Método | Endpoint | Descripción | Parámetros |
|--------|---------|-------------|------------|
| `POST` | `/login` | Iniciar sesión | `{ email, password }` |
| `POST` | `/logout` | Cerrar sesión | `{}` |

## Usuarios

| Método | Endpoint | Descripción | Parámetros |
|--------|---------|-------------|------------|
| `POST` | `/users` | Crear usuario | `{ name, email, UUID, password }` |
| `GET` | `/users/{id}` | Obtener información de un usuario | `{ id }` |
| `PUT` | `/users/{id}` | Actualizar datos de usuario | `{ name, email, UUID, password }` |
| `DELETE` | `/users/{id}` | Eliminar usuario | `{ id }` |
| `GET` | `/users/{id}/balance` | Ver saldo de un usuario | `{ id }` |
| `GET` | `/users/balances` | Ver saldo de todos los usuarios | `{}` |
| `GET` | `/users/{id}/transactions` | Ver historial de transacciones | `{ id }` |

## Gestión de Saldo

| Método | Endpoint | Descripción | Parámetros |
|--------|---------|-------------|------------|
| `POST` | `/users/{id}/balance/add` | Agregar dinero a un usuario | `{ id, amount }` |
| `POST` | `/users/{id}/balance/subtract` | Eliminar dinero de un usuario | `{ id, amount }` |

## Productos

| Método | Endpoint | Descripción | Parámetros |
|--------|---------|-------------|------------|
| `POST` | `/products` | Agregar producto | `{ name, quantity, price }` |
| `DELETE` | `/products/{id}` | Eliminar producto | `{ id }` |
| `PATCH` | `/products/{id}/quantity` | Modificar cantidad de producto | `{ id, quantity }` |
| `PATCH` | `/products/{id}/price` | Modificar precio del producto | `{ id, price }` |
| `PATCH` | `/products/{id}/restock` | Agregar stock de un producto | `{ id, quantity }` |
| `GET` | `/products` | Listar productos disponibles | `{}` |
| `GET` | `/products/{id}` | Ver detalles de un producto | `{ id }` |
| `GET` | `/products/print` | Imprimir lista de productos | `{}` |

## Compras y Devoluciones

| Método | Endpoint | Descripción | Parámetros |
|--------|---------|-------------|------------|
| `POST` | `/purchases` | Comprar un producto | `{ user_id, product_id, quantity }` |
| `POST` | `/returns` | Devolver un producto | `{ user_id, product_id, quantity }` |
| `GET` | `/purchases` | Historial de compras | `{}` |
| `GET` | `/returns` | Historial de devoluciones | `{}` |

## RFID & Hardware

| Método | Endpoint | Descripción | Parámetros |
|--------|---------|-------------|------------|
| `POST` | `/rfid/user` | Procesar tarjeta RFID | `{ UUID }` |
| `POST` | `/code/user` | Procesar el codigo de usuario | `{ UUID }` |
| `POST` | `/rfid/product` | Comprar con RFID | `{ UUID, prodzuct_id, quantity }` |
| `POST` | `/code/product` | Comprar con codigo | `{ UUID, product_id, quantity }` |
| `POST` | `/rfid/getCard` | Solicitar leer una tarjeta. Devuelve el UUID leido | `{}` |
| `GET` | `/rfid/status` | Verificar estado del lector RFID | `{}` |

## Administración

| Método | Endpoint | Descripción | Parámetros |
|--------|---------|-------------|------------|
| `GET` | `/stats` | Ver estadísticas de la nevera | `{}` |


# TODO

### Servidor

- [x]  Crear endpoints en el archivo de routes/api.php
- [x]  Crear controladores para los endpoints
    - [x]  Revisar que esta todos los controladores
    - [x]  Revisar que todos los controladores tienen los métodos necesarios
    - [x]  Revisar que se conectan a los modelos correctamente y hacen las operaciones necesarias
- [x]  Crear modelos para las tablas de la base de datos
- [x]  Crear migraciones para las tablas de la base de datos
- [x]  Crear seeders para poblar la base de datos
- [ ]  Crear tests para los endpoints
- [ ]  Crear documentación para los endpoints (Esta pachi pacha, falta mas info)
- [x]  Crear interfaz web para la gestión de la nevera con React
    - [x]  Login
    - [x]  Registro
    - [x]  Hacer las interfazes del control
    - [x]  Panel lateral por roles (admin y usuario)
        - [ ]  Hacer las interfazes del Dashboard
            - [ ]  cantidades vendidas total por día semana mes y cantidades por socio
        - [x]  Hacer las interfazes de los Productos
            - [x]  Mostrar todos los productos actuales con la foto
            - [x]  Poder agregar  producto con la foto (procesarla a webp al subirla)
            - [x]  Si es admin, mostrar la opccion de modificar [nombre, precio, cantidad en nevera]
            - [x]  Si haces click en el producto salir popup de confirmar compra
        - [x]  Hacer las interfazes de los usuarios
            - [x]  Mostrar las transacciones (falta hacer coincidir los campos con los de la BBDD)
            - [x]  Hacer las llamadas a la api de agregar y eliminar dinero (SWAL)
            - [ ]  Hacer funcion en elmenu de las transaciones para poder devolver un producto (si no han pasado mas de 2 minutos de la compra)
        - [ ]  Hacer las interfazes de las estadísticas
- [ ]  Crear aplicación móvil para la gestión de la nevera con React Native

### Hardware

- [x]  Programar la ESP32
- [x]  Probar ESP32
    - [x]  Probar autenticar usuario
    - [x]  Probar comprar producto
    - [x]  Probar coger status
    - [x]  Probar leer tarjeta remotamente
    - [ ]  Implementar pin IRQ (interupcion por hardware) para la lectura? Investigar al respecto
- [ ]  Disenar caja para la ESP32

## Problemas conocidos

- [x]  La ESP32 no sirve bien el servidor HTTP y crashea, posiblemente por la falta de memoria
- [x]  No funciona bien el teclado y la lectura NFC en paralelo
- [ ]  En la pantalla de comprar producto solo se puede comprar haciendo clickl en la imagen si eres admin

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
