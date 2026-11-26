import { config } from "dotenv";

config({ path: ".env.local" });

import { hashPassword } from "better-auth/crypto";
import { and, eq, isNull } from "drizzle-orm";

const NOMBRES_DEMO = [
  "Ana María Restrepo",
  "Carlos Andrés Pérez",
  "Diana Carolina Gómez",
  "Juan Pablo Rodríguez",
  "Laura Sofía Martínez",
  "Andrés Felipe García",
  "Camila Torres",
  "Santiago Mejía",
  "Valentina Ramírez",
  "Sebastián Castro",
  "Natalia Herrera",
  "Diego Alejandro López",
  "Paula Andrea Ríos",
  "Julián Esteban Mora",
  "Manuela Cardona",
  "Felipe Ospina",
  "Sara Lucía Vargas",
  "Mateo Jaramillo",
  "Daniela Zapata",
  "Nicolás Arango",
  "Isabella Quintero",
  "Samuel Betancur",
  "Mariana Salazar",
  "Tomás Echeverri",
  "Gabriela Uribe",
];

const CUOTA_AHORRO_DEMO = 50_000;

type Credenciales = {
  username: string;
  password: string;
  email: string;
  name: string;
  role: "admin" | "socio";
  socioId?: string;
};

async function main() {
  const { db } = await import("./index");
  const schema = await import("./schema");
  const { calcularPeriodo } = await import("../lib/periods");

  console.log("\n🌱 Sembrando datos demo de NatilleraApp...\n");

  async function asegurarPeriodo(anioInicio: number, estado: "activo" | "cerrado") {
    const calculado = calcularPeriodo(anioInicio);
    const [existente] = await db
      .select()
      .from(schema.periodos)
      .where(eq(schema.periodos.nombre, calculado.nombre))
      .limit(1);

    if (existente) {
      console.log(`  · periodo ${calculado.nombre} ya existe (${existente.estado})`);
      return existente;
    }

    const [periodo] = await db
      .insert(schema.periodos)
      .values({
        nombre: calculado.nombre,
        fechaInicio: calculado.fechaInicio,
        fechaFin: calculado.fechaFin,
        estado,
      })
      .returning();

    await db.insert(schema.configuracionPeriodo).values({
      periodoId: periodo.id,
      diaPago: 20,
      moraBase: 5_000,
      moraDiasBase: 3,
      moraPorDia: 1_000,
      valorPolla: 10_000,
      interesPrestamo: 5,
    });

    console.log(`  · periodo ${calculado.nombre} creado (${estado})`);
    return periodo;
  }

  async function asegurarSociosYAsignaciones(periodoId: string) {
    for (const [indice, nombre] of NOMBRES_DEMO.entries()) {
      const [existenteSocio] = await db
        .select()
        .from(schema.socios)
        .where(and(eq(schema.socios.nombre, nombre), isNull(schema.socios.deletedAt)))
        .limit(1);

      let socio = existenteSocio;

      if (!socio) {
        const [creado] = await db
          .insert(schema.socios)
          .values({ nombre, telefono: `300 000 00${String(indice).padStart(2, "0")}` })
          .returning();
        socio = creado;
      }

      const numeroPolla = String(indice).padStart(2, "0");
      const [asignacion] = await db
        .select()
        .from(schema.periodoSocios)
        .where(
          and(
            eq(schema.periodoSocios.periodoId, periodoId),
            eq(schema.periodoSocios.socioId, socio.id),
          ),
        )
        .limit(1);

      if (!asignacion) {
        await db.insert(schema.periodoSocios).values({
          periodoId,
          socioId: socio.id,
          numeroPolla,
          cuotaAhorro: CUOTA_AHORRO_DEMO,
          estado: "activo",
        });
      }
    }

    console.log(`  · ${NOMBRES_DEMO.length} socios asegurados con números 00-24`);
  }

  async function crearUsuario(credenciales: Credenciales) {
    const [existente] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.username, credenciales.username))
      .limit(1);

    if (existente) {
      console.log(`  · usuario ${credenciales.username} ya existe (${existente.role})`);
      return existente;
    }

    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(credenciales.password);

    await db.insert(schema.user).values({
      id: userId,
      name: credenciales.name,
      email: credenciales.email,
      emailVerified: true,
      username: credenciales.username,
      displayUsername: credenciales.name,
      role: credenciales.role,
      socioId: credenciales.socioId,
      mustChangePassword: false,
    });

    await db.insert(schema.account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
    });

    console.log(`  · usuario ${credenciales.username} creado (${credenciales.role})`);
    return { id: userId };
  }

  const periodoAnterior = await asegurarPeriodo(2025, "cerrado");
  const periodoActual = await asegurarPeriodo(2026, "activo");

  await asegurarSociosYAsignaciones(periodoAnterior.id);
  await asegurarSociosYAsignaciones(periodoActual.id);

  const [primerSocio] = await db
    .select({
      socioId: schema.periodoSocios.socioId,
      nombre: schema.socios.nombre,
    })
    .from(schema.periodoSocios)
    .innerJoin(schema.socios, eq(schema.periodoSocios.socioId, schema.socios.id))
    .where(eq(schema.periodoSocios.periodoId, periodoActual.id))
    .orderBy(schema.periodoSocios.numeroPolla)
    .limit(1);

  console.log("\n👤 Usuarios demo:");
  await crearUsuario({
    username: process.env.SEED_ADMIN_USERNAME ?? "admin",
    password: process.env.SEED_ADMIN_PASSWORD ?? "Admin123!",
    email: "admin@natillera.local",
    name: "Administrador",
    role: "admin",
  });

  await crearUsuario({
    username: process.env.SEED_SOCIO_USERNAME ?? "socio",
    password: process.env.SEED_SOCIO_PASSWORD ?? "Socio123!",
    email: "socio@natillera.local",
    name: primerSocio?.nombre ?? "Socio Demo",
    role: "socio",
    socioId: primerSocio?.socioId,
  });

  console.log("\n✅ Semilla completada.");
  console.log(
    `   Admin: ${process.env.SEED_ADMIN_USERNAME ?? "admin"} / ${process.env.SEED_ADMIN_PASSWORD ?? "Admin123!"}`,
  );
  console.log(
    `   Socio: ${process.env.SEED_SOCIO_USERNAME ?? "socio"} / ${process.env.SEED_SOCIO_PASSWORD ?? "Socio123!"}`,
  );
  console.log(`   Periodo activo: ${periodoActual.nombre}\n`);

  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Error en la semilla:", error);
  process.exit(1);
});
