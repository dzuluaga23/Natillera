# NatilleraApp

Aplicación web mobile-first para administrar una natillera: ahorros y mora, polla, rifas, préstamos, bolsillos de banco, liquidación anual y auditoría.

- Idioma: español (Colombia)
- Moneda: pesos colombianos enteros (COP, sin centavos)
- Zona horaria: `America/Bogota`
- Periodos: diciembre a noviembre, 12 cuotas mensuales

> **Estado:** Sprint 0 completado y base de datos en **Supabase**. Sprint 1 en curso. Los módulos de negocio se construyen por sprints y los pendientes aparecen como "Pronto" en la navegación.

## Stack

| Capa            | Tecnología                                               |
| --------------- | -------------------------------------------------------- |
| Framework       | Next.js 15 (App Router, RSC) + TypeScript                |
| Estilos         | Tailwind CSS v4 + shadcn/ui (`base-nova`, Base UI)       |
| Datos           | Supabase PostgreSQL + Drizzle ORM                        |
| Autenticación   | Better Auth (usuario + contraseña, sin registro público) |
| Formularios     | React Hook Form + Zod                                    |
| Tablas          | TanStack Table                                           |
| Estado servidor | TanStack Query                                           |
| Estado cliente  | Zustand (reservado para el editor de matrices)           |
| Pruebas         | Vitest + Playwright                                      |
| Calidad         | Biome (lint + formato)                                   |

## Requisitos

- Node.js 22+
- Proyecto **Supabase** (PostgreSQL 15+) o un PostgreSQL local equivalente
- npm

## Puesta en marcha

```bash
npm install
copy .env.example .env.local   # Windows
cp .env.example .env.local     # macOS / Linux
npm run db:migrate
npm run db:seed
npm run dev
```

La app queda en <http://localhost:3000> y redirige según el rol.

### Cuentas demo

| Rol           | Usuario | Contraseña  |
| ------------- | ------- | ----------- |
| Administrador | `admin` | `Admin123!` |
| Socio         | `socio` | `Socio123!` |

La semilla crea:

- Periodo `Natillera 2025-2026` (cerrado) y `Natillera 2026-2027` (activo).
- 25 socios ficticios con **25 números de polla dispersos** entre los 100 posibles (`03`, `07`, `11`, …).
- Cuota de ahorro demo de `$50.000`, mora base `$5.000` y polla `$10.000`.

## Variables de entorno

Ver `.env.example`. Las obligatorias son:

| Variable              | Uso                                                                   |
| --------------------- | --------------------------------------------------------------------- |
| `DATABASE_URL`        | Conexión de la app: **transaction pooler** de Supabase (puerto 6543)  |
| `DIRECT_URL`          | Conexión para migraciones: **session pooler** o directa (puerto 5432) |
| `BETTER_AUTH_SECRET`  | Secreto de sesiones (mínimo 32 caracteres)                            |
| `BETTER_AUTH_URL`     | URL pública del servidor de auth                                      |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app                                                 |

`.env.local` nunca se versiona.

### Base de datos (Supabase)

La base definitiva es **Supabase PostgreSQL**. Las tablas se crean con Drizzle, no con el editor SQL.

1. En el dashboard del proyecto: **Connect** (o _Settings → Database → Connection string_).
2. Copiar el **transaction pooler** (6543) en `DATABASE_URL`.
3. Copiar el **session pooler** o la conexión directa (5432) en `DIRECT_URL`.
4. `npm run db:migrate` y `npm run db:seed`.

El cliente de base de datos usa `prepare: false`, requerido por el pooler. No hay RLS de Supabase: la autenticación es Better Auth y el aislamiento por socio se aplica en el servidor.

## Scripts

| Comando               | Descripción                               |
| --------------------- | ----------------------------------------- |
| `npm run dev`         | Servidor de desarrollo (Turbopack)        |
| `npm run build`       | Build de producción                       |
| `npm start`           | Servidor de producción                    |
| `npm run lint`        | Biome: lint + formato (sin escribir)      |
| `npm run lint:fix`    | Biome: corrige formato y lint seguro      |
| `npm run typecheck`   | TypeScript sin emitir                     |
| `npm run test`        | Pruebas unitarias (Vitest)                |
| `npm run test:e2e`    | Pruebas end-to-end (Playwright)           |
| `npm run db:generate` | Genera migración desde `src/db/schema.ts` |
| `npm run db:migrate`  | Aplica migraciones                        |
| `npm run db:seed`     | Siembra datos demo (idempotente)          |
| `npm run db:studio`   | Drizzle Studio                            |

## Estructura

```
src/
  app/
    (auth)/login          Login público
    (app)/                Área autenticada con shell
      admin/              Panel y módulos del administrador
      mi/                 Vistas de solo lectura del socio
      design/             Sistema de diseño
    api/auth/[...all]/    Handler de Better Auth
  components/
    auth/                 Formulario de login
    brand/                Logo
    common/               Tarjetas, placeholders, helpers
    layout/               AppShell, navegación, selector de periodo
    polla/                Padrón de números 00–99
    ui/                   Componentes shadcn/ui (Base UI)
  db/
    schema.ts             Esquema Drizzle
    seed.ts               Semilla demo
  lib/                    Auth, sesión, permisos, dinero, periodos
  modules/
    ahorros/domain/       Reglas de mora y tests
    polla/                Números 00–99, validación y padrón
drizzle/                  Migraciones SQL generadas
e2e/                      Pruebas Playwright
```

## Reglas de negocio implementadas

- **Socios:** alta, edición, retiro y baja del periodo con auditoría. El número de polla se elige con un selector 00–99 que marca los ocupados; el retiro conserva el número y la baja lo libera sin borrar el historial.
- **Números de polla:** cada socio elige un número del **00 al 99**. No son consecutivos ni dependen de la cantidad de socios: con 25 socios hay 25 ocupados y 75 libres. Un número es único por periodo y siempre se guarda con dos cifras (`7` → `07`).
- Cálculo de mora sugerida: hasta el día 20 `$0`; días 21–23 `$5.000`; desde el 24, `$5.000 + $1.000` por día adicional.
- Cálculo de los 12 meses del periodo (diciembre–noviembre) con día de pago configurable.
- Último viernes de cada mes para los sorteos de polla.
- Toda cifra monetaria se guarda y opera como entero COP.

El padrón completo (100 números, ocupados y libres) ya está disponible en **Polla** para el admin y en **Polla general** para los socios. Los sorteos y premios se implementan en el Sprint 2; el resto de reglas, en sus sprints.

## Sprints

| Sprint | Alcance                                                | Estado      |
| ------ | ------------------------------------------------------ | ----------- |
| 0      | Fundaciones: DB, auth, diseño, shell, docs             | ✅          |
| 1      | Socios, configuración, ahorros y mora, administradores | 🔄 en curso |
| 2      | Polla y rifas                                          | ⏳          |
| 3      | Préstamos y banco/conciliación                         | ⏳          |
| 4      | Liquidación, PDF, auditoría, exportaciones             | ⏳          |

## Git

Repositorio remoto: <https://github.com/dzuluaga23/Natillera>. Cada sprint se cierra con commits atómicos y un tag (`sprint-0`, `sprint-1`, …) y push a `main`.

## Documentación para agentes

Ver [`AGENTS.md`](./AGENTS.md) para contexto técnico, convenciones y estado del proyecto.
