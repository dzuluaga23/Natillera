# NatilleraApp

Aplicación web mobile-first para administrar una natillera: ahorros y mora, polla, rifas, préstamos, bolsillos de banco, liquidación anual y auditoría.

- Idioma: español (Colombia)
- Moneda: pesos colombianos enteros (COP, sin centavos)
- Zona horaria: `America/Bogota`
- Periodos: diciembre a noviembre, 12 cuotas mensuales

> **Estado:** Sprint 0 completado (fundaciones). Los módulos de negocio se construyen en los siguientes sprints y aparecen como "Pronto" en la navegación.

## Stack

| Capa            | Tecnología                                               |
| --------------- | -------------------------------------------------------- |
| Framework       | Next.js 15 (App Router, RSC) + TypeScript                |
| Estilos         | Tailwind CSS v4 + shadcn/ui (`base-nova`, Base UI)       |
| Datos           | PostgreSQL + Drizzle ORM                                 |
| Autenticación   | Better Auth (usuario + contraseña, sin registro público) |
| Formularios     | React Hook Form + Zod                                    |
| Tablas          | TanStack Table                                           |
| Estado servidor | TanStack Query                                           |
| Estado cliente  | Zustand (reservado para el editor de matrices)           |
| Pruebas         | Vitest + Playwright                                      |
| Calidad         | Biome (lint + formato)                                   |

## Requisitos

- Node.js 22+
- PostgreSQL 15+ (local) o un proyecto Supabase
- npm

## Puesta en marcha

```bash
npm install
cp .env.example .env.local    # completar credenciales
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
- 25 socios ficticios con números de polla `00`–`24`.
- Cuota de ahorro demo de `$50.000`, mora base `$5.000` y polla `$10.000`.

## Variables de entorno

Ver `.env.example`. Las obligatorias son:

| Variable              | Uso                                                          |
| --------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`        | Conexión usada por la app (pooler de Supabase en producción) |
| `DIRECT_URL`          | Conexión directa para migraciones Drizzle                    |
| `BETTER_AUTH_SECRET`  | Secreto de sesiones (mínimo 32 caracteres)                   |
| `BETTER_AUTH_URL`     | URL pública del servidor de auth                             |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app                                        |

`.env.local` nunca se versiona.

### Migrar a Supabase

1. Crear el proyecto en Supabase y copiar las cadenas de conexión.
2. `DATABASE_URL`: pooler en modo transaction (puerto `6543`) con `?pgbouncer=true`.
3. `DIRECT_URL`: conexión directa (puerto `5432`) para `npm run db:migrate`.
4. Ejecutar `npm run db:migrate` y `npm run db:seed` apuntando a Supabase.

El cliente de base de datos ya usa `prepare: false`, requerido por el pooler.

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
    ui/                   Componentes shadcn/ui (Base UI)
  db/
    schema.ts             Esquema Drizzle
    seed.ts               Semilla demo
  lib/                    Auth, sesión, permisos, dinero, periodos
  modules/
    ahorros/domain/       Reglas de mora y tests
drizzle/                  Migraciones SQL generadas
e2e/                      Pruebas Playwright
```

## Reglas de negocio implementadas

- Cálculo de mora sugerida: hasta el día 20 `$0`; días 21–23 `$5.000`; desde el 24, `$5.000 + $1.000` por día adicional.
- Cálculo de los 12 meses del periodo (diciembre–noviembre) con día de pago configurable.
- Último viernes de cada mes para los sorteos de polla.
- Toda cifra monetaria se guarda y opera como entero COP.

Las reglas restantes (polla, rifas, préstamos, liquidación) se implementan en sus sprints.

## Sprints

| Sprint | Alcance                                                | Estado |
| ------ | ------------------------------------------------------ | ------ |
| 0      | Fundaciones: DB, auth, diseño, shell, docs             | ✅     |
| 1      | Socios, configuración, ahorros y mora, administradores | ⏳     |
| 2      | Polla y rifas                                          | ⏳     |
| 3      | Préstamos y banco/conciliación                         | ⏳     |
| 4      | Liquidación, PDF, auditoría, exportaciones             | ⏳     |

## Git

Repositorio local, sin remoto. Cada sprint se cierra con commits atómicos y un tag (`sprint-0`, `sprint-1`, …). No se hace push hasta conectar GitHub.

## Documentación para agentes

Ver [`AGENTS.md`](./AGENTS.md) para contexto técnico, convenciones y estado del proyecto.
