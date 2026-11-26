import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Liquidación del periodo",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Liquidación del periodo"
      description="Cierra el periodo, calcula lo que recibe cada socio y genera el estado de cuenta en PDF."
      sprint="Sprint 4"
      backHref="/admin"
      features={[
        "Cálculo de ahorro, mora, préstamos y utilidades por socio",
        "Cierre del periodo con confirmación explícita",
        "Reapertura controlada y auditada",
        "Estado de cuenta y resumen general en PDF",
      ]}
    />
  );
}
