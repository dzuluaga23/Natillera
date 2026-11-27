# AGENTS.md

Contexto para agentes y desarrolladores que trabajen en **NatilleraApp**.

## 1. Qué es el producto

Aplicación web **mobile-first**, en **español**, para administrar una natillera colombiana.

- **Moneda:** COP entero (sin centavos). Nunca usar `float` para dinero.
- **Zona horaria:** `America/Bogota`.
- **Periodos:** diciembre (año X) a noviembre (año X+1), 12 cuotas mensuales.
- **Filosofía:** el administrador llena todo a mano como en un Excel. El sistema **sugiere** valores (mora, premios, reparto) pero el admin puede sobrescribirlos. Nada se bloquea por reglas automáticas: se **avisa**, no se impide.
- **Socios:** solo lectura de sus propios datos y de la polla general. Nunca escriben.
- **Requisitos completos:** `C:\Users\Admin\Downloads\natillera-requisitos-v2.md` (fuera del repo).

### Roles

| Rol     | Permisos                                                                          |
| ------- | --------------------------------------------------------------------------------- |
| `admin` | Todo. Máximo **3** admins, mínimo **1**. Gestionan otras cuentas admin.           |
| `socio` | Solo lectura de su información + polla completa (números, resultados, ganadores). |

## 2. Estado actual

**Sprint 0 completado y base de datos en Supabase.** Existe:

- Esquema de base de datos y migraciones aplicadas en **Supabase PostgreSQL**.
- Semilla demo idempotente con 2 periodos, 25 socios y 2 usuarios.
- Better Auth con usuario/contraseña (sin registro público).
- Shell responsive, login, panel admin, resumen de socio y páginas "Pronto" para cada módulo pendiente.
- **Padrón de polla 00–99** con validación de formato y unicidad, semilla con números dispersos y vistas para admin y socio.
- **CRUD de socios del periodo** con selector de número, retiro, baja lógica y auditoría de cada cambio.
- Página `/design` con paleta, tipografía y componentes.
- Pruebas unitarias de dinero, periodos, mora y números de polla + smoke tests E2E.
- CI de GitHub Actions y documentación.

Los módulos aún no implementados están marcados con `soon: true` en `src/components/layout/nav-items.ts`.

| Sprint | Alcance                                              | Estado      |
| ------ | ---------------------------------------------------- | ----------- |
| 0      | Fundaciones                                          | ✅          |
| 1      | Socios, configuración, ahorros/mora, administradores | 🔄 en curso |
| 2      | Polla (sorteos) y rifas                              | ⏳          |
| 3      | Préstamos y banco/conciliación                       | ⏳          |
| 4      | Liquidación, PDF, auditoría, exportaciones           | ⏳          |

## 3. Stack y decisiones

- **Next.js 15.5** con App Router, React 19, TypeScript estricto, carpeta `src/`.
- **Tailwind CSS v4** con tokens en `src/app/globals.css`.
- **shadcn/ui** con registro `base-nova` y **Base UI** (`@base-ui/react`), **no Radix**.
- **Drizzle ORM** + `postgres` (postgres.js). Migraciones en `drizzle/`.
- **Better Auth** con plugin `username`; `emailAndPassword.disableSignUp = true`.
- **TanStack Query** para datos de cliente, **TanStack Table** para grillas, **React Hook Form + Zod** para formularios, **Zustand** reservado para el editor de matrices.
- **Biome** reemplaza a ESLint/Prettier.
- **Vitest** para unitarias y **Playwright** para E2E.

## 4. Comandos

```bash
npm install
npm run dev            # desarrollo en http://localhost:3000
npm run build          # build de producción
npm run lint           # biome check (falla si hay formato o lint)
npm run lint:fix       # corrige formato
npm run typecheck      # tsc --noEmit
npm run test           # vitest run
npm run test:e2e       # playwright (requiere navegadores instalados)
npm run db:generate    # genera migración desde el esquema
npm run db:migrate     # aplica migraciones
npm run db:seed        # datos demo idempotentes
npm run db:studio      # Drizzle Studio
```

Antes de cerrar cualquier tarea: `npm run lint && npm run typecheck && npm run test && npm run build`.

## 5. Entorno y base de datos

- Desarrollo en **Windows**. La base de datos definitiva es **Supabase PostgreSQL** (proyecto `moazteypzheyuvylirbm`, región `us-east-1`).
- `DATABASE_URL` = **transaction pooler** (puerto 6543, usuario `postgres.<ref>`) para la app.
- `DIRECT_URL` = **session pooler** (puerto 5432, mismo host del pooler) para migraciones. Evita la conexión directa `db.<ref>.supabase.co`, que en este equipo es solo IPv6.
- `.env.local` contiene las cadenas completas y también `BETTER_AUTH_SECRET`, URLs y credenciales de la semilla. No se versiona.
- El cliente usa `prepare: false`, necesario para el pooler.
- **No hay RLS de Supabase**: la autenticación es Better Auth y el aislamiento por socio se aplica en el servidor.
- Un PostgreSQL local solo se usa como respaldo si Supabase no está disponible; no es la fuente de verdad.
- **Nunca** versionar `.env.local` ni secretos. `.env.example` solo lleva placeholders.

### Semilla demo

Credenciales: `admin` / `Admin123!` y `socio` / `Socio123!`.

La semilla inserta directamente en `user` + `account` usando `hashPassword` de `better-auth/crypto`. Si cambias el esquema de Better Auth, actualiza `src/db/seed.ts`.

## 6. Arquitectura

```
src/app
  (auth)/login          → login público (redirige si ya hay sesión)
  (app)/layout.tsx      → requireSession + carga de periodos + AppShell
  (app)/admin/*         → panel y módulos del admin
  (app)/mi/*            → vistas del socio
  (app)/design          → sistema de diseño
  api/auth/[...all]     → handler de Better Auth
src/components
  ui/                   → shadcn/ui (generados; no editar salvo necesidad)
  layout/               → AppShell, navegación, selector de periodo, PageHeader
  common/               → tarjetas de estadística, placeholders, LinkButton
  auth/                 → formulario de login
  brand/                → logo
src/db
  schema.ts             → tablas Drizzle + tablas de Better Auth
  seed.ts               → semilla demo
src/lib
  auth.ts               → configuración de Better Auth (servidor)
  auth-client.ts        → cliente de auth
  session.ts            → requireSession / requireAdmin / requireSocio
  permissions.ts        → helpers de rol y ruta inicial
  money.ts              → formato y parseo COP
  periods.ts            → cálculo de los 12 meses, último viernes, atrasos
src/modules/<modulo>/domain → reglas puras y testeables
src/modules/polla        → números 00–99, validación y padrón
```

### Sesión y autorización

- `requireSession()` redirige a `/login`.
- `requireAdmin()` redirige a `/mi` si el usuario no es admin.
- `requireSocio()` redirige a `/admin` si el usuario es admin.
- **Toda** página de `(app)` debe usar uno de estos guards.
- El aislamiento por socio debe aplicarse en cada consulta filtrando por `session.user.socioId`. No basta con ocultar botones.

### Base de datos

- Columnas físicas en `snake_case`; propiedades TypeScript en `camelCase`.
- Todas las tablas de negocio tienen `createdAt`, `updatedAt`, `deletedAt`, `deletedBy`. **Soft delete siempre**; nunca `DELETE` físico.
- Dinero: `bigint(..., { mode: "number" })`, enteros COP.
- Periodos: `periodos` + `periodoSocios` (número de polla único por periodo, cuota de ahorro por socio) + `configuracionPeriodo`.
- `auditoria` guarda `antes`/`despues` en `jsonb`.
- Tablas de Better Auth: `user`, `session`, `account`, `verification`. No renombrar sus columnas sin actualizar la configuración.
- Flujo de migraciones: editar `src/db/schema.ts` → `npm run db:generate` → revisar SQL → `npm run db:migrate`. No editar migraciones ya aplicadas.

### Autenticación

- Login con `authClient.signIn.username({ username, password })` (plugin `username`).
- No hay registro público: las cuentas las crea el admin.
- Roles y vínculo con socio viven en `user.role` y `user.socioId`.
- `mustChangePassword` existe en el esquema; el flujo de cambio obligatorio se implementa en el Sprint 1.

## 7. Diseño y UI

Paleta cálida beige / marrón / verde oliva, definida en `src/app/globals.css`:

| Token           | Hex       | Uso                        |
| --------------- | --------- | -------------------------- |
| `--background`  | `#F6F1E7` | Fondo                      |
| `--card`        | `#FBF8F1` | Superficies                |
| `--foreground`  | `#3B2F26` | Texto                      |
| `--primary`     | `#5F6F3E` | Acción principal (oliva)   |
| `--secondary`   | `#7A5C43` | Datos secundarios (marrón) |
| `--accent`      | `#A8B58A` | Énfasis suave (salvia)     |
| `--destructive` | `#9C4A3C` | Errores (arcilla)          |
| `--border`      | `#DDCFB8` | Bordes                     |

Estados de la matriz: `--state-ontime`, `--state-late`, `--state-partial`, `--state-unpaid`, `--state-retired`.

Convenciones:

- Tipografía: **Fraunces** (`font-heading`) para títulos, **Inter** (`font-sans`) para UI.
- Mostrar dinero con `formatCOP()` y la clase `.money` (`tabular-nums`).
- Fechas en español con los helpers de `src/lib/periods.ts`.
- Los `src/components/ui/*` importan `cn` desde el paquete `"cn"`. El código de la app puede usar `@/lib/utils`.
- Los componentes Base UI no son Radix: no copiar ejemplos de shadcn/Radix. `Button`/`Badge` aceptan `render` para renderizar otro elemento. Para enlaces con estilo de botón usar `LinkButton` (`src/components/common/link-button.tsx`).
- Los botones generados son compactos (h-8). En móvil usar `size="lg"` o `className="h-11"` para acciones táctiles.
- `lucide-react` está en v1: verificar que el icono exista antes de usarlo.
- No usar color como único indicador: los estados siempre llevan texto.
- Mobile-first: una columna por defecto, tablas con scroll horizontal, sin layouts que se rompan a 360 px.

## 8. Reglas de negocio (referencia rápida)

Verificar siempre contra el documento de requisitos antes de implementar.

- **Ahorro:** matriz socios × 12 meses. Cuota editable por socio y por mes.
- **Mora:** solo sobre ahorro. Hasta el día 20 → `$0`; 21–23 → `$5.000`; desde el 24 → `$5.000 + $1.000` por cada día después del 23. Editable por el admin.
- **Polla:** cada socio **elige su número del 00 al 99**. No son consecutivos ni dependen de la cantidad de socios: con 25 socios hay 25 ocupados y 75 libres. El número es único por periodo, se guarda con dos cifras (`7` → `07`) y la base lo exige con `CHECK (numero_polla ~ '^[0-9]{2}$')`. Aporte de `$10.000`/mes por socio. Sorteo el último viernes con las 2 últimas cifras de la Lotería de Medellín. Si cae el número de un socio al día: premio = mitad del recaudo; la otra mitad se reparte. Si no cae o el ganador no está al día: todo el recaudo se reparte. El ganador moroso igual debe pagar.
- **Rifas:** 100 números (00–99), sin repetir. 4 boletas por socio con 25 socios (su número de polla + 3). Cada socio responde por sus boletas. Ganancia de la rifa se reparte por igual. Sobrantes se asignan a mano.
- **Préstamos:** interés sugerido 5% mensual sobre saldo de capital, editable. Abonos libres. Interés cobrado = ganancia común.
- **Ganancias comunes:** mora + mitad/no premiada de polla + ganancia de rifas + intereses. Se dividen por igual entre socios **activos hasta el final**.
- **Retiro:** devuelve solo ahorros (menos deudas), pierde ganancias y su número queda inactivo. No es eliminación.
- **Liquidación:** ahorros + parte de ganancias − deudas pendientes. Premios de polla no se suman (ya se pagaron).
- **Periodos:** `activo` → `en_liquidacion` → `cerrado`. Los anteriores son solo lectura; reabrir exige confirmación y queda auditado.

## 9. Pruebas y calidad

- Reglas de negocio puras → `src/modules/<modulo>/domain/*.test.ts`.
- Helpers → `src/lib/*.test.ts`.
- Flujos críticos → `e2e/*.spec.ts` con Playwright (login, permisos, matriz, liquidación).
- `biome.json` excluye `src/components/ui`, `drizzle/`, `public/` y artefactos. No reformatear componentes generados.
- CI (`.github/workflows/ci.yml`) corre lint, tipos, unitarias, migración, semilla y build con PostgreSQL 18.

## 10. Git

- Remoto: `origin` = <https://github.com/dzuluaga23/Natillera.git>. Se hace push a `main`.
- Commits atómicos en español, convención `tipo(alcance): descripción` (`feat`, `fix`, `chore`, `docs`, `test`, `refactor`).
- Tags por sprint: `sprint-0`, `sprint-1`, …
- No commitear `.env.local`, `node_modules`, `.next`, `playwright-report`, `test-results`.

## 11. Trampas conocidas

- `src/db/index.ts` **no** importa `server-only` porque la semilla se ejecuta con `tsx` y ese paquete lanza error fuera de Next. No volver a agregarlo sin cambiar la estrategia de semilla.
- El login usa `authClient.getSession()` después de iniciar sesión para conocer el rol; no confiar en la respuesta de `signIn` para redirigir.
- Tras iniciar o cerrar sesión se navega con `window.location.assign(...)`, no con `router.push` + `router.refresh`: esa combinación puede abortar la navegación y dejar al usuario en `/login`.
- No usar `searchParams` sincrónicos en Next 15: siempre `await searchParams`.
- El selector de periodo usa el query param `?periodo=<id>`; las páginas deben leerlo y caer al periodo activo.
- Windows: las rutas con paréntesis (`(app)`, `(auth)`) requieren comillas al usar comandos de shell.
- **No ejecutar `npm run build` con el servidor de desarrollo activo**: ambos escriben en `.next` y en Windows se corrompe el manifiesto de desarrollo. Detener `npm run dev`, borrar `.next` y reiniciar.
- Si `npm run test:e2e` falla por navegadores faltantes: `npx playwright install chromium`.

## 12. Siguiente paso (Sprint 1)

Hecho ya en este bloque: padrón de polla 00–99 (dominio, `CHECK` en base, semilla dispersa, vistas de admin y socio, tests) y CRUD de socios del periodo con selector de número, retiro y baja lógica. Falta:

1. Restauración de socios desde la papelera y eliminación global del registro.
2. Configuración del periodo editable.
3. Matriz de ahorros editable con pagos, mora sugerida/override y estados.
4. Gestión de administradores y usuarios (máx. 3 admins, mínimo 1, contraseña temporal).
5. Alertas del panel admin conectadas a datos reales.
6. Pruebas de reglas de mora y permisos, y revisión con el usuario antes de seguir.
