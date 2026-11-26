import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Mis boletas",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Mis boletas"
      description="Tus números de rifa, el estado de pago y los resultados de cada rifa."
      sprint="Sprint 2"
      backHref="/mi"
      features={[
        "Boletas asignadas con su número",
        "Estado de pago de cada boleta",
        "Rifas ganadoras y premios",
      ]}
    />
  );
}
