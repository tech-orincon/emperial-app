# Emperial Boosting – Guía de Arquitectura

## Descripción del Proyecto

Marketplace de servicios de gaming (boosting). El sistema publica los servicios disponibles, los usuarios los seleccionan, y los boosters (providers) los toman para ejecutarlos.

**Roles:**
- **Guest** – Visitante sin sesión
- **Customer** – Usuario que compra servicios (rol `BUYER` en el backend)
- **Provider (Booster)** – Proveedor que ejecuta los servicios (rol `PROVIDER`)

**Repositorios:**
- `emperial-app` – este repo, frontend React
- `emperial-api` – backend NestJS + Prisma + PostgreSQL (working directory adicional)

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
| Auth | Firebase Auth (email/password) |
| Chat en tiempo real | Firestore (`onSnapshot`) |
| Pagos | Stripe (Payment Element + PaymentIntents) |
| HTTP | Axios |
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
- **No inventar campos en los DTOs.** Los tipos de `src/types/*.types.ts` son
  espejo exacto de los DTOs del backend (`emperial-api/src/modules/*/dto/`).
  Antes de tocarlos, lee el DTO real o `emperial-api/openapi.yaml`.

### Puertas de calidad
Ambas deben quedar limpias antes de dar un cambio por terminado:
```bash
npx tsc --noEmit     # debe salir sin errores
npx eslint . --ext .js,.jsx,.ts,.tsx   # 0 errores (quedan warnings de max-lines conocidos)
```

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
│   ├── AuthContext.tsx         # Firebase session + perfil del backend, role, refreshProfile
│   ├── CartContext.tsx         # Carrito, persistido en localStorage (key: "cart")
│   └── ChatContext.tsx         # Apertura del chat y canal activo
│
├── features/                  # Módulos por feature
│   ├── home/
│   │   ├── components/         # Hero, GameShowcase, FeaturedDeals, KeyFeatures,
│   │   │                       # HowItWorks, BoosterRecruitment, Testimonials
│   │   ├── hooks/useHomeData.ts
│   │   └── HomePage.tsx
│   │
│   ├── auth/
│   │   ├── AuthPage.tsx        # Router: auth → role-selection → provider-onboarding
│   │   ├── hooks/
│   │   │   ├── useOnboarding.ts
│   │   │   └── useReferenceData.ts
│   │   ├── views/
│   │   │   ├── LoginView.tsx
│   │   │   ├── RoleSelectionView.tsx
│   │   │   └── ProviderOnboardingView.tsx
│   │   └── onboarding/
│   │       ├── Step1BasicInfo.tsx
│   │       ├── Step2GamingProfile.tsx   # campos dinámicos por GameAttribute
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
│   │   ├── hooks/
│   │   │   ├── useCatalog.ts            # categorías + servicios, con refetch
│   │   │   ├── useServiceDetail.ts
│   │   │   └── useServiceReviews.ts
│   │   ├── CatalogPage.tsx
│   │   └── ServiceDetailPage.tsx
│   │
│   ├── checkout/
│   │   ├── hooks/useCheckout.ts
│   │   ├── views/
│   │   │   ├── CheckoutSuccessView.tsx
│   │   │   └── CheckoutFailedView.tsx
│   │   ├── components/
│   │   │   ├── CheckoutForm.tsx          # dentro de <Elements>: submit → orden → cobro
│   │   │   ├── StripePaymentForm.tsx     # Payment Element (iframe de Stripe)
│   │   │   ├── ProcessingOverlay.tsx
│   │   │   ├── CharacterDetailsForm.tsx
│   │   │   └── OrderSummary.tsx
│   │   └── CheckoutPage.tsx              # monta <Elements> con intent diferido
│   │
│   ├── account/
│   │   ├── hooks/
│   │   │   ├── useOrders.ts
│   │   │   └── useOrderDetail.ts
│   │   ├── ProfilePage.tsx
│   │   ├── OrdersPage.tsx
│   │   └── OrderDetailPage.tsx
│   │
│   ├── provider/
│   │   ├── hooks/useProviderDashboard.tsx
│   │   ├── components/
│   │   │   ├── JobDetailPanel.tsx
│   │   │   ├── KpiCards.tsx
│   │   │   ├── JobsQueue.tsx
│   │   │   ├── ProviderSidebar.tsx
│   │   │   └── PendingApprovalView.tsx
│   │   ├── types/provider.dashboard.types.ts
│   │   ├── ProviderDashboardPage.tsx
│   │   └── ProviderProfilePage.tsx
│   │
│   ├── chat/
│   │   ├── components/
│   │   │   ├── ConversationList.tsx
│   │   │   └── ChatWindow.tsx
│   │   ├── hooks/
│   │   │   ├── useChannels.ts           # onSnapshot sobre chat_channels
│   │   │   └── useMessages.ts           # onSnapshot sobre messages
│   │   ├── types/chat.types.ts
│   │   └── ChatCenter.tsx               # overlay global de chat
│   │
│   └── legal/
│       ├── TermsPage.tsx
│       ├── PrivacyPage.tsx
│       └── RefundPolicyPage.tsx
│
├── services/                  # Capa de integración con el backend
│   ├── api/client.ts           # Axios + interceptors (Bearer token + header uid)
│   ├── auth.service.ts         # Firebase Auth + /auth/* + /account/profile
│   ├── reference.service.ts    # /reference/* y /catalog/games (con caché en memoria)
│   ├── catalog.service.ts      # /catalog/*
│   ├── orders.service.ts       # /orders
│   ├── payments.service.ts     # /payments/intent
│   ├── provider.service.ts     # /provider/*
│   └── chat.service.ts         # escritura de mensajes en Firestore
│
├── types/                     # Espejo de los DTOs del backend
│   ├── auth.types.ts           # UserRole
│   ├── reference.types.ts      # CountryDto, TimezoneDto, GameDto, GameAttributeDto
│   ├── catalog.types.ts
│   ├── orders.types.ts
│   ├── payments.types.ts
│   └── provider.types.ts
│
├── lib/
│   ├── firebase.ts             # initializeApp, auth (localPersistence), firestore
│   ├── firebaseErrors.ts       # códigos de Firebase → mensajes legibles
│   └── stripe.ts               # loadStripe (una sola promesa por página)
│
├── App.tsx                    # Rutas + guards (RequireAuth / RequireProvider)
└── index.tsx                  # Entry point (AuthProvider → CartProvider → App)
```

---

## Rutas de la Aplicación

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | `HomePage` | Público |
| `/catalog` | `CatalogPage` | Público |
| `/service/:id` | `ServiceDetailPage` | Público |
| `/auth` | `AuthPage` | Público (redirige providers a su dashboard) |
| `/terms`, `/privacy`, `/refund-policy` | páginas legales | Público |
| `/checkout` | `CheckoutPage` | `RequireAuth` |
| `/account/profile` | `ProfilePage` | `RequireAuth` |
| `/account/orders` | `OrdersPage` | `RequireAuth` |
| `/account/orders/:id` | `OrderDetailPage` | `RequireAuth` |
| `/provider/dashboard` | `ProviderDashboardPage` | `RequireProvider` |
| `/provider/:id` | `ProviderProfilePage` | Público |

Los guards viven en `App.tsx`. Son sólo UX — la autorización real la aplica el backend.

---

## Flujos Principales

### Customer
1. **Catálogo** → selecciona juego → categoría → servicios
2. **Detalle** → elige paquete → add-ons → precio (aplica `activeOffer` si existe)
3. **Carrito** (`CartContext`, localStorage) → **Checkout** → al pulsar Pagar: `POST /orders`
   por ítem y un único `POST /payments/intent` que las cubre todas
4. **Cuenta** → historial de órdenes → detalle + chat con el provider

### Provider (Booster)
1. **Auth** → registro/login → selección de rol → onboarding de 4 pasos
2. **Gate de verificación**: si `verificationStatus !== APPROVED` se muestra `PendingApprovalView`
3. **Dashboard** → cola de jobs (pool `QUEUED` + los propios) → accept / reject / start / complete
4. Al aceptar, el backend crea el canal de chat en Firestore

### Chat
- Sobre **Firestore**, no WebSockets.
- Colección `chat_channels/{orderId}`, subcolección `messages`.
- El backend crea el canal y escribe mensajes `type: SYSTEM` en los cambios de estado.
- La app lee con `onSnapshot` (`useChannels`, `useMessages`) y escribe con `chat.service.ts`.
- Sólo se puede enviar si el canal está en `ACCEPTED | IN_PROGRESS | DISPUTED`.

---

## Integración con Backend

`services/api/client.ts` inyecta en cada request el `Bearer <firebase-id-token>` y el
header `uid`. En un 401 refresca el token una vez y reintenta; si vuelve a fallar
redirige a `/auth`. El backend sobreescribe el header `uid` con el del token
verificado, así que no es spoofeable.

| Endpoint | Servicio |
|---|---|
| `GET /auth/login` | `fetchBackendProfile()` |
| `POST /auth/user` | `registerUser()` |
| `POST /auth/onboarding/start` | `startOnboarding()` |
| `PATCH /auth/onboarding/gaming-profile` | `updateGamingProfile()` |
| `POST /auth/onboarding/skills` | `saveSkills()` |
| `PUT /auth/onboarding/availability` | `saveAvailability()` |
| `PATCH /account/profile` | `updateProfile()` |
| `GET /reference/countries`, `/timezones` | `reference.service.ts` |
| `GET /catalog/home` | `getHomeData()` |
| `GET /catalog/games` | `getGames()` |
| `GET /catalog/games/:id/attributes`, `/categories` | `reference.service.ts` |
| `GET /catalog/categories/:slug/services` | `getCategoryServices()` |
| `GET /catalog/services/:id`, `/reviews` | `catalog.service.ts` |
| `GET`/`POST /orders`, `GET /orders/:id` | `orders.service.ts` |
| `POST /payments/intent` | `payments.service.ts` |
| `POST /payments/webhook` | sólo backend — firmado por Stripe, sin token Firebase |
| `GET /provider/jobs`, `/stats`, `/profile` | `provider.service.ts` |
| `POST /provider/jobs/:id/{accept,reject,start,complete}` | `provider.service.ts` |
| `PATCH /provider/availability` | `setAvailability()` |

**Notas de contrato que se rompen fácil:**
- `GET /orders` **no pagina**: devuelve `{ data, total }`, sin `page`/`limit`.
- `OrderDto.package` y `ProviderJobDto.package` pueden ser `null`.
- Las acciones sobre jobs devuelven el `ProviderJobDto` actualizado, **no** `{ success }`.
- `PATCH /provider/availability` devuelve `{ isOnline }`, **no** `{ success }`.
- Los montos viajan como `string` (Decimal serializado). Convertir con `parseFloat` al mostrar.
- `GET /provider/stats` → `activeJobs, completedToday, earningsToday, earningsWeek, rating, totalReviews, completionRate, avgResponseMinutes`.
- `POST /payments/intent` recibe **`orderIds: number[]`**, no un id suelto: un carrito
  multi-ítem genera varias órdenes y se cobran en una sola intención. El monto lo
  calcula el backend desde las órdenes persistidas — nunca se manda desde el cliente.

---

## Estado de la App (Mock → Real)

| Feature | Estado actual | Pendiente |
|---------|--------------|-----------|
| Auth (Firebase + backend) | API real | — |
| Onboarding provider (4 pasos) | API real | `raiderioLink` no tiene columna en BD (campo retirado del form) |
| Home | API real | — |
| Catálogo y detalle de servicio | API real | — |
| Reviews de servicio | Endpoint real, **datos hardcodeados en el backend** (`MOCK_REVIEWS`) | tabla `Review` + migración |
| `ratingBreakdown` | **Fabricado** en el backend (porcentajes fijos) | derivar de reviews reales |
| Órdenes (crear/listar/detalle) | API real | — |
| Pago | **Stripe real** (Payment Element + PaymentIntent + webhook firmado) | Sólo USD. `PAID` no se usa: el webhook va directo `PENDING → QUEUED` |
| Provider dashboard (jobs + acciones) | API real | — |
| Provider stats | API real | `totalReviews` y `avgResponseMinutes` son placeholders en el backend |
| Chat | Real (Firestore) | — |
| `/provider/:id` (perfil público) | **100% mock hardcodeado** | endpoint público de perfil de provider |

---

## Deuda técnica conocida

Pendiente, deliberadamente no abordado todavía:

**Fase de seguridad (aplazada):**
- Los `POST` de catálogo (`/catalog/game`, `/category`, `/service`, `/service-offer`,
  `/games/:id/attributes`, `/services/:id/details`) están documentados como *admin*
  pero **sólo exigen un token válido** — no hay guard de rol en el backend.
- `firebase-service-account.json` y la contraseña de Postgres en `docker-compose.yml`
  están commiteados en `emperial-api`. Hay que rotar la clave y sacarla del historial.
- ~~`PaymentForm` captura datos de tarjeta en estado de React~~ — **resuelto**: sustituido
  por el Payment Element, los datos viven en el iframe de Stripe y nunca tocan la app.

**Pagos (pendientes conocidos):**
- Sólo **USD**. Multi-moneda (COP) queda aplazado: haría falta tabla de precios por
  moneda o Adaptive Pricing de Stripe.
- **Sin Stripe Connect**: la plataforma cobra todo y liquida a los boosters a mano por
  el `paymentMethod` del onboarding. `ProviderProfile.stripeAccountId` está sin usar.
- Los **reembolsos no cancelan la orden** automáticamente: `charge.refunded` también
  dispara en parciales, así que sólo se marca `Payment` como `REFUNDED` y queda para
  revisión manual.
- El estado `PAID` de `OrderStatus` no se usa; el webhook va directo `PENDING → QUEUED`.
- Falta preguntar a Stripe por escrito si aceptan el vertical de boosting antes de
  facturar en producción.

**Calidad:**
- Archivos que superan las 200 líneas (warnings de `max-lines`): `OrderDetailPage.tsx`,
  `Footer.tsx`, `ProviderProfilePage.tsx`, `ServiceDetailPage.tsx`, `useOnboarding.ts`.
- `emperial-api` nunca pasó por prettier: ~176 errores de formato en `eslint`.
  Se arreglan con `npx eslint "src/**/*.ts" --fix` en un commit aparte.
