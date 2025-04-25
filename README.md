# 🚀 Product and Task System - Frontend

## 📋 Descripción del Proyecto

Este es un frontend desarrollado con Next.js y React para un Sistema de Gestión de Productos y Tareas. El proyecto proporciona una interfaz de usuario basica y eficiente para interactuar con el backend de FastAPI.

### 🔹 Funcionalidades principales:

- Gestión de Tareas
- Gestión de Productos
- Gestión de Categorias
- Gestión de Marcas
- Gestión de Clientes

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión 18.x o superior)
- npm, yarn, o pnpm
  > [!IMPORTANT]
  > Conexión al backend de FastAPI

## ⚙️ Instalación

### 1. Clonar el repositorio

Inicia clonando el proyecto en tu carpeta de desarrollo:

```bash
$ git clone https://github.com/sethsolution/front-product
```

### 2. Acceder al proyecto

Navega al directorio del proyecto:

```bash
$ cd front-product
```

### 3. Abrir en Visual Studio Code

Abre el proyecto en tu editor:

```bash
$ code .
```

### 4. Instalar dependencias

```bash
$ npm install
```

### 5. Configurar variables de entorno

Copia el archivo de ejemplo y edita con tus valores reales:

```bash
.env.local.example > .env
```

Asegúrate de que `NEXT_PUBLIC_API_URL` apunte al servidor donde está corriendo tu API REST.

```bash
$ NEXT_PUBLIC_API_URL=http://localhost:8000/
```

## 🚀 EJECUCIÓN DEL PROYECTO

### Modo Desarrollo

Para ejecutar el proyecto en modo desarrollo:

```bash
$ npm run dev
```

## 🌐 Acceso a la Aplicación

El sistema correrá por defecto en: `http://localhost:3000`.

## 🔗 CONFIGURACIÓN DEL BACKEND

La API debe estar corriendo de manera independiente. Consulta su documentación en el repositorio correspondiente: [API REST Repo](https://github.com/henrytaby/fastapi-product)

## BIBLIOGRAFÍA

- [Next.js Documentation](https://nextjs.org/docs)
