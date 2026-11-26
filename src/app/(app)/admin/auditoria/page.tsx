import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Auditoría y papelera",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Auditoría y papelera"
      description="Consulta quién cambió qué y cuándo, y recupera registros eliminados de forma lógica."
      sprint="Sprint 4"
      backHref="/admin"
      features={[
        "Bitácora de cambios con usuario, fecha y valores anteriores",
        "Filtros por tabla, acción y rango de fechas",
        "Papelera con restauración de socios, pagos y movimientos",
        "Registro de reaperturas y cierres de periodo",
      ]}
    />
  );
}
