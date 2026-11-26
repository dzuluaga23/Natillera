import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Configuración",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Configuración"
      description="Define las reglas del periodo: día de pago, mora, valor de la polla e interés de préstamos."
      sprint="Sprint 1"
      backHref="/admin"
      features={[
        "Creación de periodos de diciembre a noviembre",
        "Día de pago, mora base, días de gracia y mora por día",
        "Valor de la polla e interés de préstamos",
        "Apertura y cierre de periodos con advertencias",
      ]}
    />
  );
}
