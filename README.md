# 🏦 Banco Exprés - Dashboard Administrativo

<div align="center">
  <img src="public/logo-actualizado.png" alt="Banco Exprés Logo" width="120" height="120">
  
  **Dashboard bancario moderno y responsive para la gestión administrativa del Banco Exprés en Cúcuta, Colombia**
  
  [![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
  
  [🚀 Demo en Vivo](#) | [📖 Documentación](src/docs/README.md) | [🐛 Reportar Bug](https://github.com/chaustrexp/Banco_Express/issues)
</div>

---

## 📋 Tabla de Contenidos

- [🎯 Características](#-características)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [📱 Responsive Design](#-responsive-design)
- [🏗️ Arquitectura](#️-arquitectura)
- [📊 Funcionalidades](#-funcionalidades)
- [🎨 Temas](#-temas)
- [📚 Documentación](#-documentación)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)

---

## 🎯 Características

### ✨ **Funcionalidades Principales**
- 🏦 **Dashboard Bancario Completo** - KPIs, gráficos y métricas en tiempo real
- 👥 **Gestión de Clientes** - CRUD completo con búsqueda avanzada
- 💳 **Administración de Cuentas** - Visualización y gestión de cuentas bancarias
- 💸 **Control de Transacciones** - Historial y procesamiento de operaciones
- 💰 **Sistema de Créditos** - Gestión de préstamos y líneas de crédito
- 🧾 **Pagos y Recaudos** - Procesamiento de pagos de servicios
- 📊 **Reportes Avanzados** - Generación de reportes personalizables
- ⚙️ **Configuración del Sistema** - Panel de administración completo

### 🎨 **Experiencia de Usuario**
- 📱 **100% Responsive** - Perfecto en móviles, tablets y escritorio
- 🌙 **Tema Claro/Oscuro** - Cambio dinámico con persistencia
- 🔍 **Búsqueda Inteligente** - Resultados en tiempo real
- 🎛️ **Filtros Avanzados** - 8 tipos de filtros personalizables
- 🔔 **Sistema de Notificaciones** - Alertas y actualizaciones en tiempo real
- ⚡ **Performance Optimizado** - Carga rápida y navegación fluida

---

## 🚀 Inicio Rápido

### 📋 **Prerrequisitos**
- Node.js 16.0 o superior
- npm 8.0 o superior
- Git

### 🛠️ **Instalación**

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/chaustrexp/Banco_Express.git
   cd Banco_Express
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### 🏗️ **Scripts Disponibles**

```bash
npm start          # Servidor de desarrollo
npm run build      # Build de producción
npm test           # Ejecutar tests
npm run eject      # Exponer configuración (no recomendado)
```

---

## 📱 Responsive Design

### 📐 **Breakpoints Soportados**
- **xs (320px+):** Teléfonos extra pequeños
- **sm (640px+):** Teléfonos pequeños y grandes
- **md (768px+):** Tablets (vertical)
- **lg (1024px+):** Tablets (horizontal) y laptops
- **xl (1280px+):** Escritorios
- **2xl (1536px+):** Escritorios grandes

### 📱 **Características Responsive**
- ✅ Navegación adaptativa con sidebar colapsible
- ✅ Grid de KPIs que se adapta (1→2→4 columnas)
- ✅ Modales optimizados para móvil
- ✅ Controles táctiles amigables (44px mínimo)
- ✅ Tipografía escalable
- ✅ Imágenes y gráficos responsivos

---

## 🏗️ Arquitectura

### 📁 **Estructura del Proyecto**
```
src/
├── components/           # Componentes React
│   ├── Layout/          # Header, Sidebar, etc.
│   ├── Dashboard/       # KPIs, Charts, etc.
│   ├── Auth/           # Autenticación
│   ├── UI/             # Componentes reutilizables
│   ├── Clients/        # Gestión de clientes
│   ├── Accounts/       # Gestión de cuentas
│   ├── Transactions/   # Gestión de transacciones
│   ├── Credits/        # Sistema de créditos
│   ├── Payments/       # Pagos y recaudos
│   ├── Reports/        # Sistema de reportes
│   └── Configuration/  # Configuración
├── context/            # Context API (Estado global)
├── styles/            # Estilos CSS organizados
│   └── components/    # Estilos por componente
├── docs/              # Documentación del proyecto
└── public/            # Assets estáticos
```

### 🔧 **Tecnologías Utilizadas**
- **Frontend:** React 18, Tailwind CSS, Chart.js
- **Estado:** Context API, React Hooks
- **Iconos:** Font Awesome
- **Build:** Create React App, Webpack
- **Linting:** ESLint, Prettier

---

## 📊 Funcionalidades

### 🏠 **Dashboard Principal**
- 📈 KPIs bancarios en tiempo real
- 📊 Gráfico de operaciones mensuales
- 💳 Tarjetas de balance con gradientes
- 📋 Transacciones recientes
- ⚡ Acciones rápidas

### 👥 **Gestión de Clientes**
- 🔍 Búsqueda avanzada de clientes
- 📝 CRUD completo de información
- 🏷️ Categorización por tipo (VIP, Activo, etc.)
- 📊 Historial de transacciones por cliente

### 💳 **Administración de Cuentas**
- 👀 Visualización de todas las cuentas
- 💰 Balances y estados en tiempo real
- 🔒 Control de estados (Activa, Bloqueada, etc.)
- 📈 Historial de movimientos

### 💸 **Control de Transacciones**
- 📋 Listado completo de operaciones
- 🔍 Filtros por tipo, fecha, monto, estado
- ✅ Procesamiento y confirmación
- 📊 Estadísticas de transacciones

---

## 🎨 Temas

### 🌞 **Tema Claro**
- Colores institucionales del banco
- Alta legibilidad y contraste
- Diseño profesional y limpio

### 🌙 **Tema Oscuro**
- Reducción de fatiga visual
- Mejor para uso nocturno
- Colores optimizados para pantallas

### ⚙️ **Configuración**
- Toggle en el header para cambio rápido
- Persistencia en localStorage
- Transiciones suaves entre temas

---

## 📚 Documentación

### 📖 **Documentación Disponible**
- [📋 Guía General](src/docs/README.md)
- [🏗️ Componentes de Layout](src/docs/components/Layout.md)
- [📊 Componentes de Dashboard](src/docs/components/Dashboard.md)
- [🎨 Componentes de UI](src/docs/components/UI.md)
- [🔐 Sistema de Autenticación](src/docs/components/Auth.md)
- [📑 Secciones Funcionales](src/docs/components/Sections.md)

### 📝 **Reportes de Desarrollo**
- [✅ Estado Final del Proyecto](FINAL_STATUS_REPORT.md)
- [📱 Optimización Responsive](RESPONSIVE_OPTIMIZATION_COMPLETE.md)
- [📚 Estructura de Documentación](DOCUMENTATION_STRUCTURE_COMPLETE.md)
- [🚀 Características Implementadas](FEATURES_IMPLEMENTED.md)

---

## 🤝 Contribuir

### 🛠️ **Cómo Contribuir**
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 📋 **Guías de Contribución**
- Sigue las convenciones de código establecidas
- Documenta nuevas funcionalidades
- Incluye tests para nuevas características
- Mantén el diseño responsive

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Desarrollado por

**Banco Exprés Development Team**
- 🏢 **Institución:** Banco Exprés
- 📍 **Ubicación:** Cúcuta, Norte de Santander, Colombia
- 📧 **Contacto:** desarrollo@bancoexpres.com

---

## 🙏 Agradecimientos

- React Team por el excelente framework
- Tailwind CSS por el sistema de diseño
- Chart.js por los gráficos interactivos
- Font Awesome por la iconografía
- La comunidad open source

---

<div align="center">
  <p><strong>🏦 Banco Exprés - Innovación en Servicios Bancarios</strong></p>
  <p>Hecho con ❤️ en Cúcuta, Colombia</p>
</div>