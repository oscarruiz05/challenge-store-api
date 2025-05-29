# Challenge Store API

Una API de comercio electrónico construida con NestJS que permite gestionar productos, clientes, transacciones y entregas. Esta aplicación implementa una arquitectura limpia con un enfoque de dominio dirigido por el diseño (DDD).

## Tecnologías

- **Backend**: NestJS v11
- **Base de datos**: PostgreSQL 17
- **ORM**: TypeORM
- **Contenedores**: Docker y Docker Compose
- **Validación**: class-validator
- **Comunicación en tiempo real**: Socket.IO
- **Programación de tareas**: @nestjs/schedule
- **Testing**: Jest

## Instalación

### Requisitos previos

- Node.js (v18 o superior)
- npm o yarn
- Docker y Docker Compose (para entorno containerizado)
- PostgreSQL (si se ejecuta localmente)

### Configuración local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/oscarruiz05/challenge-store-api.git
   cd challenge-store-api
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp example.env .env
   # Editar .env con tus configuraciones
   ```

4. Ejecutar migraciones:
   ```bash
   npm run migration:run
   ```

5. Cargar datos iniciales (opcional):
   ```bash
   npm run seed
   ```

6. Iniciar la aplicación:
   ```bash
   npm run start:dev
   ```

### Usando Docker

1. Configurar variables de entorno:
   ```bash
   cp example.env .env
   ```

2. Iniciar los contenedores:
   ```bash
   docker-compose up -d
   ```

## Modelo Entidad-Relación

![image](https://github.com/user-attachments/assets/f326a253-2842-4d04-a7f6-5087fe7e025a)


## Cobertura de pruebas

La aplicación cuenta con una amplia cobertura de pruebas unitarias:

![Cobertura de pruebas](https://github.com/user-attachments/assets/e2e86179-9437-4968-b68d-a2aadc0d2692)

Para ejecutar las pruebas:
```bash
# Pruebas unitarias
npm run test

# Cobertura de pruebas
npm run test:cov
```
