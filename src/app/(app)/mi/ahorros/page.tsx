import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Mis ahorros",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Mis ahorros"
      description="Consulta tus cuotas del periodo, las fechas de pago y la mora registrada."
      sprint="Sprint 1"
      backHref="/mi"
      features={[
        "Cuotas de diciembre a noviembre con su estado",
        "Mora aplicada y fecha real de cada pago",
        "Total ahorrado y total pendiente",
        "Detalle de observaciones del administrador",
      ]}
    />
  );
}
