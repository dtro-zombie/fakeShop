# 🛍️ FakeShop - E-commerce React Moderno

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-B73BFE?logo=vite)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.1-7952B3?logo=bootstrap)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)

FakeShop es una aplicación de comercio electrónico completa construida con React que simula una experiencia de compra real con catálogo de productos, carrito de compras y proceso de checkout.

![Captura de FakeShop](https://raw.githubusercontent.com/dtro-zombie/fakeShop/main/public/screenshot.png)

## ✨ Características destacadas

- 🏪 **Catálogo de productos** con 20+ items simulados
- 🔍 **Búsqueda y filtrado** de productos
- 🛒 **Carrito interactivo** con persistencia en localStorage
- 📱 **Diseño responsive** para todos los dispositivos
- ⚡ **Rendimiento optimizado** con Vite
- 🎨 **UI moderna** con Bootstrap 5 y CSS personalizado
- 🔄 **Gestión de estado** con Context API
- 📬 **Simulación de checkout** con validación

## 🛠️ Tecnologías utilizadas

| Tecnología       | Versión  | Uso                          |
|------------------|----------|------------------------------|
| React            | 18.2.0   | Biblioteca principal         |
| React Router DOM | 6.14.2   | Navegación SPA               |
| Bootstrap        | 5.3.1    | Estilos y componentes UI     |
| Vite             | 4.4.5    | Bundler y entorno de desarrollo |
| Font Awesome     | 6.4.0    | Iconos modernos              |
| react-toastify   | 9.1.3    | Notificaciones interactivas  |

## 🚀 Cómo comenzar

### Prerrequisitos
- Node.js ≥ 16.x
- npm ≥ 8.x o yarn ≥ 1.22.x

### Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/dtro-zombie/fakeShop.git
cd fakeShop

    Instalar dependencias:

bash

npm install
# o
yarn

    Iniciar la aplicación:

bash

npm run dev
# o
yarn dev


🏗️ Estructura del código
text

src/
├── components/
│   ├── Cart/            # Componentes del carrito
│   ├── Product/         # Tarjetas y detalles de producto
│   ├── UI/              # Componentes reutilizables
│   └── Layout.jsx       # Estructura principal
├── context/
│   └── CartContext.jsx  # Lógica global del carrito
├── pages/
│   ├── CartPage.jsx     # Página del carrito
│   ├── HomePage.jsx     # Página principal
│   └── ProductPage.jsx  # Detalle de producto
├── App.jsx              # Rutas principales
└── main.jsx             # Punto de entrada

🎯 Funcionalidades clave
Experiencia de producto

    Vista en grid y lista de productos

    Detalles completos por producto

    Galería de imágenes (hover effect)

    Rating visual de productos

Carrito de compras

    ✨ Añadir/eliminar productos

    🔢 Ajustar cantidades

    💾 Persistencia (localStorage)

    📝 Resumen de compra

    🚫 Carrito vacío con CTA

Checkout simulado

    Formulario de envío validado

    Resumen de pedido

    Animación de "compra exitosa"

    Reinicio del carrito post-compra

📱 Responsive Design

    Mobile-first approach

    Menú hamburguesa en móviles

    Grid adaptable

    Tamaños de texto responsivos

