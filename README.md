# Product and Task System - Frontend

## Descripción General

Este proyecto es el frontend de un sistema de gestión de productos, tareas, clientes, categorías y marcas. Está desarrollado con **Next.js** y **React**, y se conecta a una [API REST](https://github.com/henrytaby/fastapi-product) construida con FastAPI. Proporciona una interfaz moderna y responsiva para la administración de los recursos del sistema.

## Funcionalidades Principales

- Autenticación de usuarios (registro, login, perfil)
- Gestión de tareas
- Gestión de productos (con categorías y marcas)
- Gestión de clientes
- Dashboard con estadísticas y accesos rápidos(funcionalidad en estapa inicial)

## Requisitos Previos

- Node.js 18.x o superior
- npm, yarn o pnpm
- Acceso a la API backend (FastAPI)

## Instalación y Puesta en Marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/sethsolution/front-product
```

### 2. Acceder al proyecto

```bash
cd front-product
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y edítalo con tus valores reales:

```bash
cp .env.local.example .env
```

Asegúrate de que `NEXT_PUBLIC_API_URL` apunte al backend:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 5. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)


## Scripts Útiles

- `npm run dev`: Ejecuta el proyecto en modo desarrollo
- `npm run build`: Compila la aplicación para producción
- `npm run start`: Inicia la aplicación en modo producción

## Flujo de Autenticación y Conexión

- El frontend utiliza JWT para autenticación. El token se almacena en localStorage tras el login o registro.
- Todas las peticiones protegidas incluyen el token en el header `Authorization`.
- Si el token expira o es inválido, el usuario es redirigido a la pantalla de login.

## Conexión con el Backend

Asegúrate de que la API de FastAPI esté corriendo y accesible en la URL configurada en `NEXT_PUBLIC_API_URL`.

## Recursos y Bibliografía

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Repositorio Backend - fastapi-product](https://github.com/henrytaby/fastapi-product)
