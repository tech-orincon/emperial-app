# Emperial Boosting – Guía de Arquitectura

## Descripción del Proyecto

Marketplace de servicios de gaming (boosting). El sistema publica los servicios disponibles, los usuarios los seleccionan, y los boosters (providers) los toman para ejecutarlos.

**Roles:**
- **Guest** – Visitante sin sesión
- **Customer** – Usuario que compra servicios
- **Provider (Booster)** – Proveedor que ejecuta los servicios

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 18 + TypeScript |
| Routing | React Router DOM v6 |
| Build | Vite 5 |
| Estilos | Tailwind CSS 3 |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Notificaciones | Sonner (toasts) |
| Gestor de paquetes | pnpm |

---

## Estructura de Directorios

```
src/
├── components/
│   ├── ui/                    # Componentes base reutilizables (átomos)
│   │   ├── Button.tsx
│   │   ├── GlassCard.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   └── layout/                # Componentes de layout global
│       ├── Navbar.tsx          # Navegación + manejo de rol (guest/customer/provider)
│       └── Footer.tsx
│
├── context/                   # React Context providers (estado global)
│   ├── AuthContext.tsx         # Auth state: rol de usuario, sesión
│   └── ChatContext.tsx         # Chat state: conversaciones, notificaciones
│
├── features/                  # Módulos por feature (estructura principal)
│   ├── home/
│   │   ├── components/         # Secciones de la landing page
│   │   │   ├── Hero.tsx
│   │   │   ├── GameShowcase.tsx
│   │   │   ├── FeaturedDeals.tsx
│   │   │   ├── KeyFeatures.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── BoosterRecruitment.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── TrustSection.tsx
│   │   │   └── Services.tsx
│   │   └── HomePage.tsx
│   │
│   ├── auth/
│   │   └── AuthPage.tsx        # Login / Signup / Onboarding de Provider
│   │
│   ├── catalog/
│   │   ├── components/         # Piezas del catálogo
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── GameSelector.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   └── ServiceGrid.tsx
│   │   ├── CatalogPage.tsx     # Listado de servicios por juego/categoría
│   │   └── ServiceDetailPage.tsx
│   │
│   ├── checkout/
│   │   └── CheckoutPage.tsx    # Flujo de pago multi-paso
│   │
│   ├── account/               # Área del Customer
│   │   ├── ProfilePage.tsx
│   │   ├── OrdersPage.tsx
│   │   └── OrderDetailPage.tsx
│   │
│   ├── provider/              # Área del Booster
│   │   ├── ProviderDashboardPage.tsx
│   │   ├── ProviderLoginPage.tsx
│   │   └── ProviderProfilePage.tsx
│   │
│   ├── chat/                  # Sistema de chat (soporte + provider-customer)
│   │   ├── components/
│   │   │   └── FloatingSupportChat.tsx
│   │   └── ChatCenter.tsx
│   │
│   └── legal/
│       ├── TermsPage.tsx
│       ├── PrivacyPage.tsx
│       └── RefundPolicyPage.tsx
│
├── services/                  # Capa de integración con el backend (API)
│   ├── api/
│   │   └── client.ts           # Cliente HTTP base (axios/fetch configurado)
│   ├── auth.service.ts         # Endpoints: login, signup, logout, session
│   ├── catalog.service.ts      # Endpoints: servicios, categorías, juegos
│   ├── orders.service.ts       # Endpoints: órdenes, historial, estado
│   └── provider.service.ts     # Endpoints: dashboard booster, jobs, earnings
│
├── types/                     # Tipos TypeScript centralizados
│   ├── auth.types.ts           # UserRole, User, Session
│   ├── catalog.types.ts        # Service, Category, Game, Tier
│   ├── orders.types.ts         # Order, OrderStatus, OrderDetail
│   └── provider.types.ts       # Provider, Job, Earnings
│
├── App.tsx                    # Definición de rutas (React Router)
└── index.tsx                  # Entry point
```

---

## Rutas de la Aplicación

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | `HomePage` | Público |
| `/catalog` | `CatalogPage` | Público |
| `/service/:id` | `ServiceDetailPage` | Público |
| `/checkout` | `CheckoutPage` | Customer |
| `/auth` | `AuthPage` | Guest |
| `/account/profile` | `ProfilePage` | Customer |
| `/account/orders` | `OrdersPage` | Customer |
| `/account/orders/:id` | `OrderDetailPage` | Customer |
| `/provider/dashboard` | `ProviderDashboardPage` | Provider |
| `/provider/:id` | `ProviderProfilePage` | Público |
| `/terms` | `TermsPage` | Público |
| `/privacy` | `PrivacyPage` | Público |
| `/refund-policy` | `RefundPolicyPage` | Público |

---

## Flujos Principales

### Customer
1. **Catálogo** → selecciona juego → selecciona categoría → ve servicios
2. **Detalle del servicio** → elige tier (Basic/Standard/Premium) → add-ons → precio
3. **Checkout** → datos del personaje → pago → confirmación
4. **Cuenta** → historial de órdenes → detalle + chat con provider

### Provider (Booster)
1. **Auth** → registro/login → onboarding (skills, disponibilidad, tarifas)
2. **Dashboard** → cola de jobs disponibles → acepta/rechaza
3. **Ejecución** → chat con customer → marca como completado

### Chat
- Chat global persistente (`ChatCenter`) accesible desde cualquier página
- Conversaciones tipo: soporte general y conversaciones por orden con provider

---

## Patrones de Arquitectura

- **Feature-based** – Cada feature es un módulo autocontenido bajo `features/`
- **Atomic UI** – `components/ui/` contiene componentes base sin lógica de negocio
- **Layout separado** – `components/layout/` contiene Navbar y Footer globales
- **Contextos** – Estado global vía React Context API (Auth, Chat)
- **Capa de servicios** – `services/` abstrae todas las llamadas al backend
- **Tipos centralizados** – `types/` evita duplicar interfaces entre features

---

## Integración con Backend (Pendiente)

La app actualmente usa **mock data** y `setTimeout` para simular respuestas. La integración real debe hacerse en `services/`:

```
services/api/client.ts     ← configurar baseURL, headers, interceptors (auth token)
services/auth.service.ts   ← reemplazar mock login/signup
services/catalog.service.ts ← reemplazar arrays hardcodeados
services/orders.service.ts  ← reemplazar datos de órdenes
services/provider.service.ts ← reemplazar dashboard mock
```

El `AuthContext` debe gestionar el token de sesión y adjuntarlo a cada request via el cliente HTTP.

---

## Estado de la App (Mock → Real)

| Feature | Estado actual | Pendiente |
|---------|--------------|-----------|
| Auth | Mock (simula login) | JWT / OAuth real |
| Catálogo | Datos hardcodeados | API GET /services |
| Checkout | Simula pago | Stripe / procesador real |
| Órdenes | Datos hardcodeados | API GET /orders |
| Chat | UI mockeada | WebSockets / real-time |
| Provider Dashboard | Datos hardcodeados | API GET /jobs |

---

## Convenciones de Código

- Componentes en **PascalCase** (`ServiceCard.tsx`)
- Hooks en **camelCase** con prefijo `use` (`useAuth`)
- Servicios en **camelCase** con sufijo `.service.ts`
- Tipos en **PascalCase** en archivos `.types.ts`
- Exportaciones nombradas (no default exports)
- Tailwind CSS para estilos; no crear CSS custom salvo en `index.css`
