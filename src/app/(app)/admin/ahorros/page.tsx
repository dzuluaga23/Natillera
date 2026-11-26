import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Ahorros y mora",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Ahorros y mora"
      description="La matriz mensual de pagos: quién pagó, cuándo y cuánta mora le corresponde según la configuración del periodo."
      sprint="Sprint 1"
      backHref="/admin"
      features={[
        "Matriz de 12 meses por socio con totales y saldos",
        "Cuota de ahorro editable por socio, con valor sugerido",
        "Mora sugerida por día de atraso, con override del administrador",
        "Estados de pago: a tiempo, con mora, parcial, pendiente y retirado",
        "Registro de pagos con fecha real y observaciones",
      ]}
    />
  );
}
