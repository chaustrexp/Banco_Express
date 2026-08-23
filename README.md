# 🏦 Banco Exprés - Sistema Bancario Digital

<div align="center">
  <img src="public/img/logo/logo.jpeg" alt="Banco Exprés Logo" width="120" height="120" style="border-radius:16px">
  
  **Sistema bancario digital completo con panel administrativo y portal de clientes. Desarrollado para Banco Exprés en Cúcuta, Colombia.**
  
  [![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Express](https://img.shields.io/badge/Express-4.0+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  
  [📖 Documentación](src/docs/README.md) | [🐛 Reportar Bug](https://github.com/chaustrexp/Banco_Express/issues)
</div>

---

## 📋 Tabla de Contenidos

- [🎯 Características](#-características)
- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [👤 Roles y Credenciales](#-roles-y-credenciales)
- [📊 Módulos del Sistema](#-módulos-del-sistema)
- [🎨 Diseño y UI](#-diseño-y-ui)
- [📄 Licencia](#-licencia)

---

## 🎯 Características

### ✨ **Sistema Fullstack Completo**
- 🔐 **Autenticación JWT** - Login seguro con roles diferenciados (Admin / Cliente)
- 🏦 **Panel Administrativo** - Gestión completa de clientes, cuentas y transacciones
- 👤 **Portal del Cliente** - Dashboard personalizado, transferencias y recargas
- 📡 **API REST** - Backend en Node.js + Express con MySQL
- 🔴 **Tiempo Real** - Notificaciones via Socket.io
- 🌙 **Modo Oscuro/Claro** - Tema persistente en localStorage
- 📱 **100% Responsive** - Diseño mobile-first

### 🎨 **Experiencia de Usuario Premium**
- ✨ Glassmorphism en la pantalla de login/registro
- 🎨 Branding personalizado con colores del logo institucional
- 📸 Fotos de perfil dinámicas según rol y género
- 🔔 Sistema de notificaciones en tiempo real
- ⚡ Navegación fluida sin recargas de página

---

## 🏗️ Arquitectura

### 📁 **Estructura del Proyecto**

```
Banco_Express/
├── backend/                    # API REST - Node.js + Express
│   ├── config/
│   │   └── db.js              # Conexión MySQL
│   ├── controllers/           # Lógica de negocio
│   │   ├── authController.js
│   │   ├── clientsController.js
│   │   ├── accountsController.js
│   │   ├── transactionsController.js
│   │   ├── creditsController.js
│   │   ├── reportsController.js
│   │   └── dashboardController.js
│   ├── routes/                # Endpoints de la API
│   ├── middlewares/           # JWT auth, roles
│   ├── services/              # Servicio de auditoría
│   ├── database/
│   │   └── init.sql           # Script de la base de datos
│   ├── server.js              # Punto de entrada del backend
│   └── .env                   # Variables de entorno (no incluido en Git)
│
├── src/                       # Frontend - React 18
│   ├── components/
│   │   ├── Auth/              # Login y Registro (Glassmorphism)
│   │   ├── Layout/            # Header y Sidebar con logo
│   │   ├── Dashboard/         # KPIs, gráficos, transacciones recientes
│   │   ├── Customer/          # Portal del cliente
│   │   │   ├── CustomerDashboard.js
│   │   │   ├── CustomerAccounts.js
│   │   │   ├── CustomerTransfers.js
│   │   │   └── CustomerRecharge.js
│   │   ├── Clients/           # Gestión de clientes (Admin)
│   │   ├── Accounts/          # Gestión de cuentas (Admin)
│   │   ├── Transactions/      # Historial transaccional (Admin)
│   │   ├── Credits/           # Sistema de créditos
│   │   ├── Payments/          # Pagos y servicios
│   │   ├── Reports/           # Reportes avanzados
│   │   ├── Admin/             # Auditoría del sistema
│   │   ├── Configuration/     # Configuración
│   │   └── UI/                # Componentes reutilizables
│   ├── context/
│   │   ├── AuthContext.js     # Estado global de autenticación
│   │   └── BankContext.js     # Estado global del banco
│   ├── utils/
│   │   ├── api.js             # Wrapper fetch con JWT automático
│   │   └── avatarHelper.js    # Fotos de perfil por rol/género
│   └── docs/                  # Documentación de componentes
│
├── public/
│   ├── img/
│   │   ├── logo/              # Logo institucional
│   │   ├── foto de perfil/    # Avatares por rol y género
│   │   └── fondo/             # Fondo de pantalla de login
│   └── index.html
│
├── tailwind.config.js         # Paleta de colores personalizada
└── .env                       # Variables de entorno frontend
```

### 🔧 **Stack Tecnológico**

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Tailwind CSS, Chart.js |
| Backend | Node.js, Express.js |
| Base de Datos | MySQL 8.0 |
| Autenticación | JWT (jsonwebtoken), bcrypt |
| Tiempo Real | Socket.io |
| Iconos | Font Awesome 6 |
| Fuentes | Google Fonts (Inter) |

---

## 🚀 Inicio Rápido

### 📋 **Prerrequisitos**
- Node.js 18.0 o superior
- MySQL 8.0 o superior
- Git

### 🛠️ **Instalación Paso a Paso**

#### 1. Clonar el repositorio
```bash
git clone https://github.com/chaustrexp/Banco_Express.git
cd Banco_Express
```

#### 2. Configurar la Base de Datos
```bash
# Importar el esquema en MySQL
mysql -u root -p < backend/database/init.sql
```

#### 3. Configurar el Backend
```bash
cd backend
```

Crear el archivo `backend/.env`:
```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_contraseña
DB_NAME=banco_express
JWT_SECRET=tu_secreto_jwt
```

```bash
npm install
npm run dev   # Inicia en http://localhost:5001
```

#### 4. Configurar el Frontend
```bash
# Desde la raíz del proyecto
npm install
npm start     # Inicia en http://localhost:3000
```

---

## 👤 Roles y Credenciales

El sistema maneja **dos roles** con vistas completamente diferentes:

### 🔴 Administrador
| Campo | Valor |
|---|---|
| Email | `admin@bancoexpres.com` |
| Contraseña | `admin123` |
| Acceso | Panel completo de gestión |

**Módulos disponibles:** Dashboard, Clientes, Cuentas, Transacciones, Créditos, Pagos, Reportes, Auditoría, Configuración.

### 🔵 Cliente
| Campo | Valor |
|---|---|
| Email | Tu correo registrado |
| Contraseña | Tu contraseña |
| Acceso | Portal personalizado |

**Módulos disponibles:** Mi Resumen, Mis Cuentas, Transferencias, Recargar Cuenta, Pagar Servicios.

> 💡 Los clientes pueden registrarse directamente desde la pantalla de login. El sistema crea automáticamente su cuenta bancaria al registrarse.

---

## 📊 Módulos del Sistema

### 🔐 Autenticación
- Login y registro con diseño glassmorphism
- Detección automática de rol al iniciar sesión
- Token JWT con expiración de 24 horas
- Foto de perfil dinámica según rol y género

### 🏠 Dashboard Administrativo
- KPIs bancarios (clientes, transacciones, balance total)
- Gráfico de operaciones mensuales (Chart.js)
- Transacciones recientes en tiempo real
- Acciones rápidas de operación

### 👥 Gestión de Clientes
- CRUD completo (crear, editar, eliminar)
- Búsqueda por nombre, cédula o email
- Estado del cliente (Activo, VIP, Inactivo)
- Creación automática de cuenta al registrar cliente

### 💳 Cuentas Bancarias
- Visualización de todas las cuentas
- Saldos en tiempo real desde la base de datos
- Control de estado (Activa / Bloqueada)
- Apertura de nuevas cuentas

### 💸 Transacciones
- Historial completo de operaciones
- Filtros por tipo, fecha, monto y estado
- Depósitos, retiros y transferencias

### 👤 Portal del Cliente
- Resumen de saldo y cuentas personales
- Transferencias entre cuentas
- Recarga de saldo en efectivo
- Historial de movimientos

### 📊 Reportes
- Generación de reportes personalizables
- Filtros por rango de fecha
- Exportación de datos

### 🔍 Auditoría
- Registro automático de todas las acciones del sistema
- Trazabilidad completa por usuario

---

## 🎨 Diseño y UI

### 🎨 Paleta de Colores Institucional
Los colores del sistema están basados en el logo de Banco Exprés:
- **Primario (Azul):** `#1B4FBF` y variantes
- **Secundario (Verde):** `#10B981` y variantes

### 📸 Fotos de Perfil Dinámicas
El sistema selecciona automáticamente la foto de perfil correcta:
- 👨 **Cliente Hombre** → foto de perfil rol cliente version hombre
- 👩 **Cliente Mujer** → foto de perfil rol cliente version mujer
- 👔 **Administrador** → foto de perfil rol admin

### 🌙 Modo Oscuro
Disponible en todas las vistas, con toggle en el header superior. La preferencia se guarda automáticamente.

---

## 📡 API Endpoints

### Autenticación
```
POST   /api/auth/login          # Iniciar sesión
POST   /api/auth/register       # Registrar usuario
POST   /api/auth/change-password # Cambiar contraseña
```

### Clientes (requiere admin)
```
GET    /api/clients             # Listar todos
GET    /api/clients/email/:email # Buscar por email
POST   /api/clients             # Crear cliente
PUT    /api/clients/:cedula     # Actualizar
DELETE /api/clients/:cedula     # Eliminar
```

### Cuentas
```
GET    /api/accounts            # Listar todas (admin)
GET    /api/accounts/client/:id # Cuentas del cliente
POST   /api/accounts            # Crear cuenta (admin)
PUT    /api/accounts/:id/status # Cambiar estado
```

### Transacciones
```
GET    /api/transactions        # Listar todas (admin)
GET    /api/transactions/client/:id # Del cliente
POST   /api/transactions        # Crear transacción
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/NuevaFuncionalidad`
3. Commit: `git commit -m 'feat: agrega nueva funcionalidad'`
4. Push: `git push origin feature/NuevaFuncionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <p><strong>🏦 Banco Exprés - Innovación en Servicios Bancarios Digitales</strong></p>
  <p>Hecho con ❤️ en Cúcuta, Norte de Santander, Colombia</p>
  <p>
    <a href="https://github.com/chaustrexp/Banco_Express">⭐ Dale una estrella al repo</a> •
    <a href="https://github.com/chaustrexp/Banco_Express/issues">🐛 Reportar un bug</a>
  </p>
</div>