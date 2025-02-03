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
- NodeJS
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
- Clonar el repositorio con git
- Instalar las dependencias con composer `composer install`
- Copia el archivo .env.example a .env y modifica las variables de entorno `cp .env.example .env`
- Modifica e introduce la ip de tu lector RFID en el archivo .env en `ESP32_IP=<Tu_IP>`
- Modifica los datos de la base de datos en el archivo .env para que coincidan con tu base de datos
- Migrar la base de datos con `php artisan migrate`
- Instala las dependencias de node `npm install` (Puedes usar bun, yarn o cualquier otro gestor de paquetes)
- Genera las paginas con `npm run build`


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
| `POST` | `/rfid/product` | Comprar con RFID | `{ UUID, product_id, quantity }` |
| `POST` | `/rfid/getCard` | Solicitar leer una tarjeta. Devuelve el UUID leido | `{}` |
| `POST` | `/rfid/authenticate` | Autenticar usuario con RFID | `{ UUID }` |
| `GET` | `/rfid/status` | Verificar estado del lector RFID | `{}` |

## Administración

| Método | Endpoint | Descripción | Parámetros |
|--------|---------|-------------|------------|
| `GET` | `/stats` | Ver estadísticas de la nevera | `{}` |


# TODO

#### Servidor
- [ ] Crear endpoints en el archivo de routes/api.php
- [ ] Crear controladores para los endpoints
- [ ] Crear modelos para las tablas de la base de datos
- [ ] Crear migraciones para las tablas de la base de datos
- [ ] Crear seeders para poblar la base de datos
- [ ] Crear tests para los endpoints
- [ ] Crear documentación para los endpoints
- [ ] Crear interfaz web para la gestión de la nevera con React
- [ ] Crear aplicación móvil para la gestión de la nevera con React Native

#### Hardware
- [ ] Programar la ESP32
- [ ] Probar ESP32
- [ ] Disenar caja para la ESP32

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
