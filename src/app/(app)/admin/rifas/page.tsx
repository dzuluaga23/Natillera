import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const metadata: Metadata = {
  title: "Rifas",
};

export default function Page() {
  return (
    <ModulePlaceholder
      title="Rifas"
      description="Lleva el control de boletas, vendedores, ganadores y ganancia neta de cada rifa."
      sprint="Sprint 2"
      backHref="/admin"
      features={[
        "Rifas con valor de boleta y cantidad de números",
        "Asignación de boletas a socios y vendedores externos",
        "Ganador, premio y utilidad de la rifa",
        "Control de boletas pagadas y pendientes",
      ]}
    />
  );
}
