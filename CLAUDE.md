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

## Principios AI-First (Obligatorios)

Este proyecto usa arquitectura **AI-First**: cada archivo debe ser comprensible y editable de forma aislada, sin necesidad de leer el proyecto completo.

### Reglas de tamaño
- **Máximo ~200 líneas por archivo** (enforced con ESLint `max-lines: warn`)
- Si un archivo supera 150 líneas, evalúa si tiene más de una responsabilidad
- Si un componente supera 200 líneas, extrae sub-componentes o un hook

### Capas de un feature (orden de data flow)
```
views/       ← Orquesta el layout, llama hooks, sin lógica de negocio
hooks/       ← Estado + lógica de UI, llama services
components/  ← Piezas visuales reutilizables dentro del feature
services/    ← Llamadas al backend (apiClient), sin estado
types/       ← Interfaces y tipos, sin lógica
```

### Convenciones de nombres
- Componentes: **PascalCase** (`ServiceCard.tsx`)
- Hooks: **camelCase** con prefijo `use` (`useOnboarding.ts`)
- Servicios: **camelCase** con sufijo `.service.ts` (`auth.service.ts`)
- Tipos: **PascalCase** en archivos `.types.ts` (`reference.types.ts`)
- **Solo exportaciones nombradas** (nunca `export default`)
- Tailwind CSS para estilos; no crear CSS custom salvo en `index.css`

### Qué NO hacer
- No mezclar lógica de negocio con JSX en el mismo archivo
- No crear componentes inline dentro de otros componentes
- No duplicar tipos — definirlos una vez en `types/` o junto a su hook
- No agregar comentarios obvios ni docstrings innecesarios
- No crear abstracciones para uso único

---

## Estructura de Directorios

```
src/
├── components/
│   ├── ui/                    # Átomos reutilizables sin lógica de negocio
│   │   ├── Button.tsx
│   │   ├── GlassCard.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   └── layout/                # Layout global
│       ├── Navbar.tsx          # Orquesta GuestNav / CustomerNav / ProviderNav
│       ├── Footer.tsx
│       └── nav/               # Sub-componentes del Navbar
│           ├── GuestNav.tsx
│           ├── CustomerNav.tsx
│           ├── ProviderNav.tsx
│           └── MobileMenuContent.tsx
│
├── context/                   # React Context providers (estado global)
│   ├── AuthContext.tsx         # Auth state: user, role, refreshProfile
│   └── ChatContext.tsx         # Chat state: conversaciones, notificaciones
│
├── features/                  # Módulos por feature
│   ├── home/
│   │   ├── components/         # Secciones de la landing page
│   │   └── HomePage.tsx
│   │
│   ├── auth/
│   │   ├── AuthPage.tsx        # Router: auth → role-selection → onboarding
│   │   ├── hooks/
│   │   │   ├── useOnboarding.ts
│   │   │   └── useReferenceData.ts
│   │   ├── views/
│   │   │   ├── LoginView.tsx
│   │   │   ├── RoleSelectionView.tsx
│   │   │   └── ProviderOnboardingView.tsx
│   │   └── onboarding/
│   │       ├── Step1BasicInfo.tsx
│   │       ├── Step2GamingProfile.tsx
│   │       ├── Step3Skills.tsx
│   │       ├── Step4Availability.tsx
│   │       └── Step5Success.tsx
│   │
│   ├── catalog/
│   │   ├── components/
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── GameSelector.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceGrid.tsx
│   │   │   ├── ServiceLoadingSkeleton.tsx
│   │   │   ├── ServiceUnavailableView.tsx
│   │   │   ├── ServiceTabs.tsx
│   │   │   └── ServiceSidebar.tsx
│   │   ├── CatalogPage.tsx
│   │   └── ServiceDetailPage.tsx
│   │
│   ├── checkout/
│   │   ├── hooks/
│   │   │   └── useCheckout.ts
│   │   ├── views/
│   │   │   ├── CheckoutSuccessView.tsx
│   │   │   └── CheckoutFailedView.tsx
│   │   ├── components/
│   │   │   ├── ProcessingOverlay.tsx
│   │   │   ├── CharacterDetailsForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── OrderSummary.tsx
│   │   └── CheckoutPage.tsx
│   │
│   ├── account/
│   │   ├── ProfilePage.tsx
│   │   ├── OrdersPage.tsx
│   │   └── OrderDetailPage.tsx
│   │
│   ├── provider/
│   │   ├── hooks/
│   │   │   └── useProviderDashboard.tsx
│   │   ├── components/
│   │   │   ├── JobDetailPanel.tsx
│   │   │   ├── KpiCards.tsx
│   │   │   ├── JobsQueue.tsx
│   │   │   ├── ProviderSidebar.tsx
│   │   │   └── PendingApprovalView.tsx
│   │   ├── types/
│   │   │   └── provider.dashboard.types.ts
│   │   ├── ProviderDashboardPage.tsx
│   │   └── ProviderProfilePage.tsx
│   │
│   ├── chat/
│   │   ├── components/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   └── FloatingSupportChat.tsx  # re-export de ChatCenter
│   │   └── ChatCenter.tsx
│   │
│   └── legal/
│       ├── TermsPage.tsx
│       ├── PrivacyPage.tsx
│       └── RefundPolicyPage.tsx
│
├── services/                  # Capa de integración con el backend
│   ├── api/
│   │   └── client.ts           # Axios + interceptors (Bearer token + uid header)
│   ├── auth.service.ts         # Endpoints de auth y onboarding
│   ├── reference.service.ts    # Endpoints de referencia (países, zonas, juegos)
│   ├── catalog.service.ts
│   ├── orders.service.ts
│   └── provider.service.ts
│
├── types/                     # Tipos TypeScript centralizados
│   ├── auth.types.ts           # UserRole, AuthUser, Session
│   ├── reference.types.ts      # CountryDto, TimezoneDto, GameDto, GameAttributeDto
│   ├── catalog.types.ts
│   ├── orders.types.ts
│   └── provider.types.ts
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
1. **Auth** → registro/login → onboarding de 4 pasos (info, gaming, skills, disponibilidad)
2. **Dashboard** → cola de jobs disponibles → acepta/rechaza
3. **Ejecución** → chat con customer → marca como completado

### Chat
- Chat global persistente (`ChatCenter`) accesible desde cualquier página
- Conversaciones tipo: soporte general y conversaciones por orden con provider

---

## Integración con Backend

```
services/api/client.ts       ← Axios con Bearer token + uid header (Firebase UID)
services/auth.service.ts     ← GET /auth/login, POST /auth/user, onboarding steps
services/reference.service.ts ← GET /reference/countries, /timezones, /catalog/games
services/catalog.service.ts  ← GET /catalog/services, /categories
services/orders.service.ts   ← GET /orders
services/provider.service.ts ← GET /provider/jobs
```

---

## Estado de la App (Mock → Real)

| Feature | Estado actual | Pendiente |
|---------|--------------|-----------|
| Auth | Firebase + backend real | — |
| Onboarding | API real (4 endpoints) | — |
| Catálogo | Datos hardcodeados | API GET /services |
| Checkout | Simula pago | Stripe / procesador real |
| Órdenes | Datos hardcodeados | API GET /orders |
| Chat | UI mockeada | WebSockets / real-time |
| Provider Dashboard | Datos hardcodeados | API GET /jobs |
