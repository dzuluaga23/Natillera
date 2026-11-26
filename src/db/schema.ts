import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Tablas de negocio.
 * Convención: snake_case en base de datos, camelCase en TypeScript.
 * Todo dinero se guarda como entero de pesos colombianos (bigint).
 */

export const socios = pgTable(
  "socios",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: text("nombre").notNull(),
    telefono: text("telefono"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    deletedBy: text("deleted_by"),
  },
  (table) => [index("socios_nombre_idx").on(table.nombre)],
);

export const periodos = pgTable("periodos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  fechaInicio: date("fecha_inicio", { mode: "string" }).notNull(),
  fechaFin: date("fecha_fin", { mode: "string" }).notNull(),
  /** activo | en_liquidacion | cerrado */
  estado: text("estado").notNull().default("activo"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  deletedBy: text("deleted_by"),
});

export const periodoSocios = pgTable(
  "periodo_socios",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    periodoId: uuid("periodo_id")
      .notNull()
      .references(() => periodos.id, { onDelete: "cascade" }),
    socioId: uuid("socio_id")
      .notNull()
      .references(() => socios.id, { onDelete: "restrict" }),
    numeroPolla: text("numero_polla").notNull(),
    cuotaAhorro: bigint("cuota_ahorro", { mode: "number" }).notNull().default(0),
    /** activo | retirado */
    estado: text("estado").notNull().default("activo"),
    fechaRetiro: date("fecha_retiro", { mode: "string" }),
    motivoRetiro: text("motivo_retiro"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    deletedBy: text("deleted_by"),
  },
  (table) => [
    uniqueIndex("periodo_socios_numero_polla_uq")
      .on(table.periodoId, table.numeroPolla)
      .where(sql`${table.deletedAt} is null`),
    uniqueIndex("periodo_socios_socio_uq")
      .on(table.periodoId, table.socioId)
      .where(sql`${table.deletedAt} is null`),
    index("periodo_socios_periodo_idx").on(table.periodoId),
  ],
);

export const configuracionPeriodo = pgTable("configuracion_periodo", {
  id: uuid("id").primaryKey().defaultRandom(),
  periodoId: uuid("periodo_id")
    .notNull()
    .references(() => periodos.id, { onDelete: "cascade" })
    .unique(),
  diaPago: integer("dia_pago").notNull().default(20),
  moraBase: bigint("mora_base", { mode: "number" }).notNull().default(5000),
  moraDiasBase: integer("mora_dias_base").notNull().default(3),
  moraPorDia: bigint("mora_por_dia", { mode: "number" }).notNull().default(1000),
  valorPolla: bigint("valor_polla", { mode: "number" }).notNull().default(10000),
  interesPrestamo: integer("interes_prestamo").notNull().default(5),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  deletedBy: text("deleted_by"),
});

export const auditoria = pgTable(
  "auditoria",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    usuarioId: text("usuario_id"),
    accion: text("accion").notNull(),
    tabla: text("tabla").notNull(),
    registroId: text("registro_id"),
    antes: jsonb("antes"),
    despues: jsonb("despues"),
    fecha: timestamp("fecha", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("auditoria_tabla_idx").on(table.tabla),
    index("auditoria_fecha_idx").on(table.fecha),
  ],
);

/**
 * Tablas de Better Auth.
 * Los nombres de propiedades deben coincidir con los modelos de Better Auth;
 * las columnas físicas se mantienen en snake_case.
 */

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    username: text("username").unique(),
    displayUsername: text("display_username"),
    /** admin | socio */
    role: text("role").notNull().default("socio"),
    socioId: uuid("socio_id").references(() => socios.id, { onDelete: "set null" }),
    mustChangePassword: boolean("must_change_password").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    deletedBy: text("deleted_by"),
  },
  (table) => [index("user_role_idx").on(table.role)],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export type Socio = typeof socios.$inferSelect;
export type Periodo = typeof periodos.$inferSelect;
export type PeriodoSocio = typeof periodoSocios.$inferSelect;
export type ConfiguracionPeriodo = typeof configuracionPeriodo.$inferSelect;
export type Usuario = typeof user.$inferSelect;
